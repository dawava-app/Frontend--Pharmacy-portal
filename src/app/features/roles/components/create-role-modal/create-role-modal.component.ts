import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Permission } from '../../roles.service';

interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-create-role-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, InputTextModule, TextareaModule],
  templateUrl: './create-role-modal.component.html',
  styleUrl: './create-role-modal.component.scss',
})
export class CreateRoleModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() permissionGroups: PermissionGroup[] = [];
  @Input() isPermissionsLoading = false;
  @Input() error = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submitRole = new EventEmitter<{ name: string; description: string; permissionIds: string[] }>();

  readonly roleName = signal('');
  readonly roleDescription = signal('');
  readonly selectedPermissionIds = signal<string[]>([]);
  readonly expandedModules = signal<Record<string, boolean>>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.clearForm();
    }

    if (changes['permissionGroups']) {
      this.pruneSelections();
      this.initializeExpandedModules();
    }
  }

  onHide(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const name = this.roleName().trim();
    const description = this.roleDescription().trim();
    if (!name || !description) {
      return;
    }

    this.submitRole.emit({
      name,
      description,
      permissionIds: this.selectedPermissionIds()
    });
  }

  clearForm(): void {
    this.roleName.set('');
    this.roleDescription.set('');
    this.selectedPermissionIds.set([]);
    this.initializeExpandedModules();
  }

  toggleModule(moduleName: string): void {
    this.expandedModules.update((state) => ({
      ...state,
      [moduleName]: !state[moduleName]
    }));
  }

  isModuleExpanded(moduleName: string): boolean {
    return !!this.expandedModules()[moduleName];
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds().includes(permissionId);
  }

  onPermissionToggle(permissionId: string, checked: boolean): void {
    this.selectedPermissionIds.update((ids) => {
      if (checked) {
        return ids.includes(permissionId) ? ids : [...ids, permissionId];
      }
      return ids.filter((id) => id !== permissionId);
    });
  }

  onModuleSelectAll(module: PermissionGroup, checked: boolean): void {
    const ids = module.permissions.map((permission) => permission.id);
    this.selectedPermissionIds.update((currentIds) => {
      if (checked) {
        return Array.from(new Set([...currentIds, ...ids]));
      }
      return currentIds.filter((id) => !ids.includes(id));
    });
  }

  isModuleFullySelected(module: PermissionGroup): boolean {
    const selected = this.selectedPermissionIds();
    return module.permissions.length > 0 && module.permissions.every((permission) => selected.includes(permission.id));
  }

  selectedCount(module: PermissionGroup): number {
    const selected = this.selectedPermissionIds();
    return module.permissions.filter((permission) => selected.includes(permission.id)).length;
  }

  formatPermissionLabel(name: string): string {
    return name
      .split(/[._-]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private initializeExpandedModules(): void {
    const modulesState: Record<string, boolean> = {};
    this.permissionGroups.forEach((group, index) => {
      modulesState[group.module] = index === 0;
    });
    this.expandedModules.set(modulesState);
  }

  private pruneSelections(): void {
    const validIds = new Set(
      this.permissionGroups.flatMap((group) => group.permissions.map((permission) => permission.id))
    );
    this.selectedPermissionIds.update((ids) => ids.filter((id) => validIds.has(id)));
  }
}
