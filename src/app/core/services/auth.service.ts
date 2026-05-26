import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { API_URL } from '../../app.config';

export interface LoginRequest {
  identifier: string;
  password: string;
  branch_id: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  scope?: {
    branch_id?: string;
    roles?: string[];
  };
}

export interface AuthBranchRole {
  id: string;
  branchId: string;
  branchName: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  assignedAt: string;
  revokedAt: string | null;
}

export interface AuthMeUser {
  branchRoles: AuthBranchRole[];
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  isActive: boolean;
  status: number;
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthMeResponse {
  success: boolean;
  data: {
    isAuthenticated: boolean;
    userId: string;
    user: AuthMeUser;
    branchId: string;
    roles: string[];
    isSystemAdmin: boolean;
    isPharmacyAdmin: boolean;
  };
}

export interface ScopeOption {
  branchId: string;
  branchName: string;
  roles: string[];
  roleNames: string[];
  isCurrent: boolean;
}

export interface AuthScopesResponse {
  is_system_admin: boolean;
  scopes: Array<{
    branch_id: string;
    roles: string[];
    is_current: boolean;
  }>;
}

export interface SwitchBranchRequest {
  branch_id: string;
  refresh_token: string;
}

export interface SwitchBranchResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: {
    roles: string[];
    branch_id: string;
  };
  available_scopes: Array<{
    branch_id: string;
    roles: string[];
  }>;
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
  private readonly apiBase = inject(API_URL);
  private readonly tokenKey = 'dawava_token';
  private readonly roleKey = 'dawava_role';
  private readonly refreshKey = 'dawava_refresh_token';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, payload).pipe(
      timeout(15000),
      tap((res) => {
        this.storeSessionTokens(res.access_token, res.refresh_token, res?.scope?.roles?.[0]);
      }),
      catchError((err) => throwError(() => new Error(this.extractErrorMessage(err)))),
    );
  }

  getMe(): Observable<AuthMeResponse> {
    return this.http.get<AuthMeResponse>(`${this.apiBase}/auth/me`);
  }

  getScopes(): Observable<ScopeOption[]> {
    return forkJoin({
      me: this.getMe().pipe(catchError(() => of(null))),
      scopes: this.http.get<AuthScopesResponse>(`${this.apiBase}/auth/scopes`),
    }).pipe(
      map(({ me, scopes }) => {
        const branchRoles = me?.data?.user?.branchRoles ?? [];
        const branchRoleGroups = new Map<string, AuthBranchRole[]>();

        for (const branchRole of branchRoles) {
          const current = branchRoleGroups.get(branchRole.branchId) ?? [];
          current.push(branchRole);
          branchRoleGroups.set(branchRole.branchId, current);
        }

        return scopes.scopes.map((scope) => {
          const branchRoleSet = branchRoleGroups.get(scope.branch_id) ?? [];
          const branchName =
            branchRoleSet[0]?.branchName ??
            (scope.branch_id === '00000000-0000-0000-0000-000000000000'
              ? 'Global'
              : `Branch ${scope.branch_id}`);
          const roleNames = Array.from(
            new Set(
              branchRoleSet
                .filter((branchRole) => branchRole.isActive)
                .map((branchRole) => branchRole.roleName)
                .filter((roleName): roleName is string => Boolean(roleName)),
            ),
          );

          return {
            branchId: scope.branch_id,
            branchName,
            roles: scope.roles,
            roleNames,
            isCurrent: scope.is_current,
          } satisfies ScopeOption;
        });
      }),
      catchError((err) => throwError(() => new Error(this.extractErrorMessage(err)))),
    );
  }

  switchBranch(branchId: string): Observable<SwitchBranchResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http
      .post<SwitchBranchResponse>(`${this.apiBase}/auth/switch-branch`, {
        branch_id: branchId,
        refresh_token: refreshToken,
      } satisfies SwitchBranchRequest)
      .pipe(
        tap((res) => {
          this.storeSessionTokens(res.access_token, res.refresh_token, res?.scope?.roles?.[0]);
        }),
        catchError((err) => throwError(() => new Error(this.extractErrorMessage(err)))),
      );
  }

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiBase}/auth/me/permissions`).pipe(
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
      .post<RefreshResponse>(`${this.apiBase}/auth/refresh`, {
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
        .post(`${this.apiBase}/auth/logout`, { refresh_token: refreshToken })
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

  private storeSessionTokens(accessToken: string, refreshToken: string, roleId?: string | null): void {
    this.setSessionItem(this.tokenKey, accessToken);
    this.setLocalItem(this.refreshKey, refreshToken);

    if (roleId) {
      this.setSessionItem(this.roleKey, roleId);
      return;
    }

    this.removeSessionItem(this.roleKey);
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
