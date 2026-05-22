// ============================================================
// Dashboard Sub-Routes
// Path: src/app/features/dashboard/dashboard.routes.ts
// Purpose: Child routes under /dashboard, one per role.
//          The Dashboard container component reads the user's
//          role and performs an automatic redirect.
// ============================================================

import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  // Redirects handled by Dashboard container — see dashboard.ts
  {
    path: 'manager',
    loadComponent: () =>
      import('./pages/manager-dashabord/manager-dashabord')
        .then(m => m.ManagerDashboard),
    title: 'Manager Dashboard – PharmaLogix',
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./pages/stuff-dashbaord/staff-dashboard')
        .then(m => m.StaffDashboard),
    title: 'Staff Dashboard – PharmaLogix',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashbaird/admin-dashbaird')
        .then(m => m.AdminDashbaird),
    title: 'Admin Dashboard – PharmaLogix',
  },
];
