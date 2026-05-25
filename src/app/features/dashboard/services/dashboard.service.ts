// ============================================================
// Base Dashboard Service
// Path: src/app/features/dashboard/services/dashboard.service.ts
// Purpose: Shared utilities for all dashboard types.
//          Provides current-user and branch resolution.
// ============================================================

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser }                from '@angular/common';
import { AuthService }                       from '../../../core/services/auth.service';
import { CurrentUser, Branch }               from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);

  // ── Role helpers ──────────────────────────────────────────

  /**
   * Returns the primary role of the logged-in user.
   * Reads from AuthService which resolves from the stored token/cookie.
   *
   * TODO: Replace with authService.getCurrentUserRole() once that method exists.
   */
  getUserRole(): string | null {
    // TODO: Connect to authService.getUserRole() or permissions endpoint.
    // Expected shape from backend: { role: 'manager' | 'staff' | 'admin' }
    try {
      return this.authService.getRole() ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Returns a typed CurrentUser from the auth service.
   * TODO: Extend AuthService to expose a `currentUser` signal.
   */
  getCurrentUser(): CurrentUser | null {
    // TODO: Wire to authService.currentUser() once available.
    return null;
  }

  // ── SSR safety ────────────────────────────────────────────

  /** True when running in a browser context (not during SSR). */
  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ── Date utilities ────────────────────────────────────────

  /** Returns a greeting based on the current hour: Morning / Afternoon / Evening. */
  getGreeting(): string {
    if (!this.isBrowser) return 'Good Morning';
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}
