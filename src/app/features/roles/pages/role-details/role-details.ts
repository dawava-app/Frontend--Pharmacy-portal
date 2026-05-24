import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Permission, RoleDetails, RolesService } from '../../roles.service';

type CrudAction = 'create' | 'read' | 'update' | 'delete';

interface ModuleMatrixRow {
  module: string;
  values: Record<CrudAction, { permissionId: string | null; active: boolean }>;
}

@Component({
  selector: 'app-role-details-page',
  standalone: true,
  imports: [RouterLink, ButtonModule, ProgressSpinnerModule],
  templateUrl: './role-details.html',
  styleUrl: './role-details.scss'
})
export class RoleDetailsPageComponent implements OnInit {
  private readonly rolesService = inject(RolesService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');
  readonly roleDetails = signal<RoleDetails | null>(null);
  readonly roleName = signal<string>('');
  readonly roleDescription = signal<string>('');
  readonly isEditMode = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly saveError = signal<string>('');
  readonly saveSuccess = signal<string>('');
  readonly allPermissions = signal<Permission[]>([]);
  readonly selectedPermissionIds = signal<string[]>([]);

  readonly matrixRows = computed<ModuleMatrixRow[]>(() => {
    const role = this.roleDetails();
    if (!role) {
      return [];
    }

    const actions: CrudAction[] = ['create', 'read', 'update', 'delete'];
    const map = new Map<string, Record<CrudAction, { permissionId: string | null; active: boolean }>>();
    const selected = new Set(this.selectedPermissionIds());
    const sourcePermissions = this.allPermissions().length ? this.allPermissions() : role.permissions;

    sourcePermissions.forEach((permission) => {
      const moduleLabel = this.getModuleLabel(permission.module);
      const current = map.get(moduleLabel) ?? {
        create: { permissionId: null, active: false },
        read: { permissionId: null, active: false },
        update: { permissionId: null, active: false },
        delete: { permissionId: null, active: false }
      };
      const action = permission.action.toLowerCase();

      if (actions.includes(action as CrudAction)) {
        const key = action as CrudAction;
        current[key] = { permissionId: permission.id, active: selected.has(permission.id) };
      } else if (permission.name.toLowerCase().includes('.read')) {
        current.read = { permissionId: permission.id, active: selected.has(permission.id) };
      } else if (permission.name.toLowerCase().includes('.create')) {
        current.create = { permissionId: permission.id, active: selected.has(permission.id) };
      } else if (permission.name.toLowerCase().includes('.update') || permission.name.toLowerCase().includes('.edit')) {
        current.update = { permissionId: permission.id, active: selected.has(permission.id) };
      } else if (permission.name.toLowerCase().includes('.delete') || permission.name.toLowerCase().includes('.remove')) {
        current.delete = { permissionId: permission.id, active: selected.has(permission.id) };
      }

      map.set(moduleLabel, current);
    });

    return Array.from(map.entries())
      .map(([module, values]) => ({ module, values }))
      .sort((a, b) => a.module.localeCompare(b.module));
  });

  ngOnInit(): void {
    const roleId = this.route.snapshot.paramMap.get('roleId');
    if (!roleId) {
      this.loading.set(false);
      this.error.set('Invalid role identifier.');
      return;
    }

    this.loadRole(roleId);
  }

  startEdit(): void {
    this.isEditMode.set(true);
    this.saveError.set('');
    this.saveSuccess.set('');
  }

  cancelEdit(): void {
    const role = this.roleDetails();
    if (!role) {
      return;
    }

    this.roleName.set(role.name);
    this.roleDescription.set(role.description ?? '');
    this.selectedPermissionIds.set(role.permissions.map((permission) => permission.id));
    this.isEditMode.set(false);
    this.saveError.set('');
    this.saveSuccess.set('');
  }

  saveChanges(): void {
    if (!this.isEditMode()) {
      return;
    }

    const role = this.roleDetails();
    if (!role) {
      return;
    }

    this.isSaving.set(true);
    this.saveError.set('');
    this.saveSuccess.set('');

    this.rolesService.patchRolePermissions(role.id, { permissionIds: this.selectedPermissionIds() }).subscribe({
      next: () => {
        this.roleDetails.set({
          ...role,
          permissions: role.permissions.filter((permission) => this.selectedPermissionIds().includes(permission.id))
        });
        this.isSaving.set(false);
        this.isEditMode.set(false);
        this.saveSuccess.set('Role permissions updated successfully.');
      },
      error: () => {
        this.isSaving.set(false);
        this.saveError.set('Failed to update role permissions.');
      }
    });
  }

  private loadRole(roleId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.rolesService.getRoleDetails(roleId).subscribe({
      next: (role) => {
        this.roleDetails.set(role);
        this.roleName.set(role.name);
        this.roleDescription.set(role.description ?? '');
        this.selectedPermissionIds.set(role.permissions.map((permission) => permission.id));
        this.isEditMode.set(false);
        this.loading.set(false);
        this.loadAllPermissions();
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load role details.');
      }
    });
  }

  togglePermission(permissionId: string | null): void {
    if (!this.isEditMode() || !permissionId) {
      return;
    }

    this.selectedPermissionIds.update((ids) => {
      if (ids.includes(permissionId)) {
        return ids.filter((id) => id !== permissionId);
      }
      return [...ids, permissionId];
    });
  }

  grantAll(): void {
    if (!this.isEditMode()) {
      return;
    }

    const allIds = this.matrixRows()
      .flatMap((row) => Object.values(row.values).map((cell) => cell.permissionId))
      .filter((id): id is string => !!id);

    this.selectedPermissionIds.set(Array.from(new Set(allIds)));
  }

  revokeAll(): void {
    if (!this.isEditMode()) {
      return;
    }
    this.selectedPermissionIds.set([]);
  }

  canEditCell(permissionId: string | null): boolean {
    return this.isEditMode() && !!permissionId;
  }

  private loadAllPermissions(): void {
    this.rolesService.getPermissions(undefined, true).subscribe({
      next: (permissions) => this.allPermissions.set(permissions),
      error: () => this.allPermissions.set([])
    });
  }

  private getModuleLabel(moduleKey: string): string {
    return moduleKey
      .split('.')
      .slice(-1)[0]
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
