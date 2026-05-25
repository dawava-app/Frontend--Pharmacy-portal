import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../app.config';

export type RoleId = string;
export type PermissionId = string;

export interface Permission {
  id: PermissionId;
  name: string;
  module: string;
  action: string;
  isActive: boolean;
  description?: string;
}

interface ApiCollectionResponse<T> {
  success?: boolean;
  data?: T[];
  items?: T[];
  result?: T[];
}

interface ApiItemResponse<T> {
  success?: boolean;
  data?: T;
  item?: T;
  result?: T;
}

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  permissionsCount?: number;
}

export interface RoleDetails extends Role {
  isSystemRole?: boolean;
  updatedAt?: string;
  permissions: Permission[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name: string;
  description: string;
}

export interface AssignPermissionsDto {
  permissionIds: PermissionId[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = inject(API_URL);

  getPermissions(module?: string, isActive?: boolean): Observable<Permission[]> {
    let params = new HttpParams();

    if (module) {
      params = params.set('Module', module);
    }
    if (isActive !== undefined) {
      params = params.set('IsActive', isActive);
    }

    return this.http
      .get<Permission[] | ApiCollectionResponse<Permission>>(`${this.apiBase}/admin/permissions`, { params })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return response;
          }

          if (!response || typeof response !== 'object') {
            return [];
          }

          if (Array.isArray(response.data)) {
            return response.data;
          }

          if (Array.isArray(response.items)) {
            return response.items;
          }

          if (Array.isArray(response.result)) {
            return response.result;
          }

          return [];
        })
      );
  }


  getPermissionById(permissionId: PermissionId): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiBase}/admin/permissions/${permissionId}`);
  }

  getPermissionsByModule(module: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiBase}/admin/permissions/modules/${module}`);
  }

  getRoles(includeInactive = false): Observable<Role[]> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<Role[]>(`${this.apiBase}/admin/roles`, { params });
  }

  getRoleById(roleId: RoleId): Observable<Role> {
    return this.http.get<Role>(`${this.apiBase}/admin/roles/${roleId}`);
  }

  getRoleDetails(roleId: RoleId): Observable<RoleDetails> {
    return this.http
      .get<RoleDetails | ApiItemResponse<RoleDetails>>(`${this.apiBase}/admin/roles/${roleId}`)
      .pipe(
        map((response) => {
          if (response && typeof response === 'object' && !Array.isArray(response)) {
            const wrapped = response as ApiItemResponse<RoleDetails>;
            const details = wrapped.data ?? wrapped.item ?? wrapped.result;
            if (details) {
              return {
                ...details,
                permissions: Array.isArray(details.permissions) ? details.permissions : []
              };
            }
          }

          const direct = response as RoleDetails;
          return {
            ...direct,
            permissions: Array.isArray(direct.permissions) ? direct.permissions : []
          };
        })
      );
  }

  createRole(payload: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(`${this.apiBase}/admin/roles`, payload);
  }

  updateRole(roleId: RoleId, payload: UpdateRoleDto): Observable<Role> {
    return this.http.put<Role>(`${this.apiBase}/admin/roles/${roleId}`, payload);
  }

  deleteRole(roleId: RoleId): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/admin/roles/${roleId}`);
  }

  addRolePermissions(roleId: RoleId, payload: AssignPermissionsDto): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/admin/roles/${roleId}/permissions`, payload);
  }

  patchRolePermissions(roleId: RoleId, payload: AssignPermissionsDto): Observable<void> {
    return this.http.patch<void>(`${this.apiBase}/admin/roles/${roleId}/permissions`, payload);
  }

  getRolePermissions(roleId: RoleId): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiBase}/admin/roles/${roleId}/permissions`);
  }

  removeRolePermission(roleId: RoleId, permissionId: PermissionId): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/admin/roles/${roleId}/permissions/${permissionId}`);
  }
}
