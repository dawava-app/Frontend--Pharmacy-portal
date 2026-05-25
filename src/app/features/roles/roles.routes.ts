import { Route } from "@angular/router";

export const roleRoutes: Route[]=[
    {
        path: 'roles',
        loadComponent: () => import('./pages/roles-page').then((m) => m.RolesPageComponent),
    },
    {
        path: 'roles/permissions',
        loadComponent: () => import('./pages/permissions/permissions').then((m) => m.Permissions)
    },
    {
        path: 'roles/:roleId',
        loadComponent: () => import('./pages/role-details/role-details').then((m) => m.RoleDetailsPageComponent)
    },
];