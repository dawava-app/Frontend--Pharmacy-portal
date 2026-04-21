import { Route } from "@angular/router";

export const roleRoutes: Route[]=[
    {
        'path':'roles', loadComponent:()=>import('./pages/roles-page').then(m=>m.RolesPageComponent),
        children:[
            {
                path:'permissions',
                loadComponent:()=>import('./pages/permissions/permissions').then(m=>m.Permissions)
            }
        ]
    }
]