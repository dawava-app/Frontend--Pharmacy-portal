import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export interface LoginRequest {
  identifier: string;
  password: string;
  branch_id: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  scope?: {
    roles?: string[];
  };
}

export interface PermissionsResponse {
  role: string;
  permissions: string[];
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly cookieService = inject(SsrCookieService);

  private readonly apiBase = '';
  private readonly tokenKey = 'dawava_token';
  private readonly roleKey = 'dawava_role';
  private readonly refreshKey = 'dawava_refresh_token';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/api/auth/login`, payload).pipe(
      timeout(15000),
      tap((res) => {
        this.setSessionItem(this.tokenKey, res.access_token);
        this.setLocalItem(this.refreshKey, res.refresh_token);
        const roleId = res?.scope?.roles?.[0];
        if (roleId) {
          this.setSessionItem(this.roleKey, roleId);
        }
      }),
      catchError((err) => throwError(() => new Error(this.extractErrorMessage(err)))),
    );
  }

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiBase}/api/auth/me/permissions`).pipe(
      tap((res) => this.setSessionItem(this.roleKey, res.role)),
      catchError((err) => {
        const savedRole = this.getRole();
        if (savedRole) {
          return of({ role: savedRole, permissions: [] });
        }
        return throwError(() => new Error(this.extractErrorMessage(err)));
      }),
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http
      .post<RefreshResponse>(`${this.apiBase}/api/auth/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((res) => {
          this.setSessionItem(this.tokenKey, res.access_token);
          this.setLocalItem(this.refreshKey, res.refresh_token);
        }),
        catchError(() => {
          this.clearAllStorage();
          this.router.navigate(['/login']);
          return throwError(() => new Error('Session expired. Please log in again.'));
        }),
      );
  }

  loginAndRedirect(payload: LoginRequest): Observable<PermissionsResponse> {
    return this.login(payload).pipe(
      switchMap((loginRes) => {
        const roleId = loginRes?.scope?.roles?.[0];
        if (roleId) {
          return of({ role: roleId, permissions: [] });
        }
        return this.getPermissions();
      }),
    );
  }

  getToken(): string | null {
    return this.getCookieItem(this.tokenKey);
  }

  getRole(): string | null {
    return this.getCookieItem(this.roleKey);
  }

  getRefreshToken(): string | null {
    return this.getCookieItem(this.refreshKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      this.clearAllStorage();
      return false;
    }

    return true;
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.http
        .post(`${this.apiBase}/api/auth/logout`, { refresh_token: refreshToken })
        .subscribe({ complete: () => undefined });
    }

    this.clearAllStorage();
    this.router.navigate(['/login']);
  }

  redirectByRole(role: string): void {
    if (role) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenParts = token.split('.');
      // If the token is not a JWT format, skip client-side expiry parsing
      // and let the backend/interceptor decide on validity.
      if (tokenParts.length < 2) {
        return false;
      }

      const payloadBase64 = tokenParts[1];
      if (!payloadBase64) {
        return true;
      }

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );
      const payload = JSON.parse(atob(padded));
      if (!payload?.exp) {
        return false;
      }
      const expiryMs = payload.exp * 1000;
      const bufferMs = 60 * 1000;
      return Date.now() > expiryMs - bufferMs;
    } catch {
      // Do not force logout on parsing errors; backend 401/refresh flow should handle invalid tokens.
      return false;
    }
  }

  private clearAllStorage(): void {
    this.removeSessionItem(this.tokenKey);
    this.removeSessionItem(this.roleKey);
    this.removeSessionItem(this.refreshKey);
    this.removeLocalItem(this.tokenKey);
    this.removeLocalItem(this.roleKey);
    this.removeLocalItem(this.refreshKey);
  }

  private extractErrorMessage(err: { status?: number }): string {
    if (err?.status === 0) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (err?.status === 401 || err?.status === 403) {
      return 'Sign in failed. Please check your email and password.';
    }
    if (err?.status === 429) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    if ((err?.status ?? 0) >= 500) {
      return 'A system error occurred. Please try again or contact IT support.';
    }
    return 'Sign in failed. Please try again.';
  }

  private getCookieItem(key: string): string | null {
    const value = this.cookieService.get(key);
    return value || null;
  }

  private setSessionItem(key: string, value: string): void {
    this.cookieService.set(key, value, { path: '/' });
  }

  private setLocalItem(key: string, value: string): void {
    this.cookieService.set(key, value, { path: '/' });
  }

  private removeSessionItem(key: string): void {
    this.cookieService.delete(key, '/');
  }

  private removeLocalItem(key: string): void {
    this.cookieService.delete(key, '/');
  }
}
