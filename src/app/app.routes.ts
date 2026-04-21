import { Routes } from '@angular/router';
import { mainRoutes } from './layouts/mainlayout/main.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/authlayout/authlayout').then((m) => m.Authlayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      {
        path: 'login',
        loadComponent: () => import('./features/authentication/login/login').then((m) => m.Login),
      },
    ],
  },
  ...mainRoutes,
  { path: '**', redirectTo: 'login' },
];
