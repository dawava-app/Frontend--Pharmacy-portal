import { Routes } from '@angular/router';
import { roleRoutes } from '../../features/roles/roles.routes';
import { authGuard } from '../../core/guards/auth.guard';

export const mainRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./mainlayout').then((m) => m.Mainlayout),
        canActivate: [authGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                loadComponent: () => import('../../features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            ...roleRoutes
        ],
    },
];