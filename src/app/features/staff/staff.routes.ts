import { Route } from '@angular/router';

export const staffRoutes: Route[] = [
  {
    path: 'staff',
    loadComponent: () => import('./pages/staff-page/staff-page').then((m) => m.StaffPageComponent),
  },
  {
    path: 'staff/:userId',
    loadComponent: () =>
      import('./pages/staff-details/staff-details').then((m) => m.StaffDetailsPageComponent),
  },
];
