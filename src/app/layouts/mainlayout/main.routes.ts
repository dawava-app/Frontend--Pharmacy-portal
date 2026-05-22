// ============================================================
// Main Layout Routes — UPDATED
// Path: src/app/layouts/mainlayout/main.routes.ts
//
// Architecture change:
//   Dashboard pages are self-contained (manage their own sidebar).
//   They now go through DashLayout (auth guard, no sidebar).
//   Other protected routes (roles, etc.) still use Mainlayout
//   which provides the shared sidebar.
// ============================================================

import { Routes }    from '@angular/router';
import { roleRoutes } from '../../features/roles/roles.routes';
import { authGuard }  from '../../core/guards/auth.guard';
import { isDevMode }  from '@angular/core';
import { DASHBOARD_ROUTES } from '../../features/dashboard/dashboard.routes';

export const mainRoutes: Routes = [

  // ── Dashboard (self-contained, manage own sidebar) ──────
  // Auth protected via DashLayout — no mainlayout sidebar.
  {
    path: '',
    loadComponent: () =>
      import('./dashlayout/dashlayout').then(m => m.DashLayout),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../../features/dashboard/dashboard').then(m => m.Dashboard),
        children: DASHBOARD_ROUTES,
      },
    ],
  },

  // ── Other Protected Routes (use Mainlayout with sidebar) ─
  {
    path: '',
    loadComponent: () => import('./mainlayout').then(m => m.Mainlayout),
    canActivate: [authGuard],
    children: [
      ...roleRoutes,
    ],
  },

  // ────────────────────────────────────────────────────────────
  // DEV-ONLY: Direct access without auth — no layout wrapper.
  // Auto-excluded from production builds via isDevMode().
  //
  //   http://localhost:4200/dev/manager-dashboard
  //   http://localhost:4200/dev/staff-dashboard
  //
  // ⚠️  These routes have NO auth guard. Dev only.
  // ────────────────────────────────────────────────────────────
  ...(isDevMode()
    ? ([
        {
          path: 'dev',
          children: [
            {
              path: 'manager-dashboard',
              loadComponent: () =>
                import('../../features/dashboard/pages/manager-dashabord/manager-dashabord')
                  .then(m => m.ManagerDashboard),
              title: '[DEV] Manager Dashboard',
            },
            {
              path: 'staff-dashboard',
              loadComponent: () =>
                import('../../features/dashboard/pages/stuff-dashbaord/staff-dashboard')
                  .then(m => m.StaffDashboard),
              title: '[DEV] Staff Dashboard',
            },
          ],
        },
      ] as Routes)
    : []),
];
