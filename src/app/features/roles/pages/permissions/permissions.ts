import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Permission, RolesService } from '../../roles.service';

interface ModuleFilterOption {
  label: string;
  value: string;
}

interface PermissionView extends Permission {
  permissionName: string;
  moduleLabel: string;
  descriptionLabel: string;
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    SelectModule,
    InputTextModule
  ],
  templateUrl: './permissions.html',
  styleUrl: './permissions.scss',
})
export class Permissions implements OnInit {
  private readonly rolesService = inject(RolesService);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');
  readonly allPermissions = signal<PermissionView[]>([]);
  readonly searchTerm = signal<string>('');
  readonly selectedModule = signal<string>('all');

  readonly moduleOptions = computed<ModuleFilterOption[]>(() => {
    const moduleSet = new Set(this.allPermissions().map((permission) => permission.moduleLabel));
    return [
      { label: 'All Modules', value: 'all' },
      ...Array.from(moduleSet).sort((a, b) => a.localeCompare(b)).map((module) => ({ label: module, value: module }))
    ];
  });

  readonly filteredPermissions = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const selectedModule = this.selectedModule();

    return this.allPermissions().filter((permission) => {
      const moduleMatches = selectedModule === 'all' || permission.moduleLabel === selectedModule;
      const searchMatches =
        !search ||
        permission.permissionName.toLowerCase().includes(search) ||
        permission.descriptionLabel.toLowerCase().includes(search);

      return moduleMatches && searchMatches;
    });
  });

  readonly shownSummary = computed(() => {
    const count = this.filteredPermissions().length;
    return `SHOWING ${count} OF ${count} PERMISSIONS`;
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onModuleChange(value: string): void {
    this.selectedModule.set(value);
  }

  getModuleSeverity(moduleLabel: string): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    const key = moduleLabel.toLowerCase();
    if (key.includes('inventory')) return 'info';
    if (key.includes('sales')) return 'danger';
    if (key.includes('admin')) return 'success';
    if (key.includes('report') || key.includes('analytics')) return 'warn';
    return 'secondary';
  }

  formatPermissionName(name: string): string {
    return name.replace(/[.]/g, '_').toUpperCase();
  }

  private loadPermissions(): void {
    this.loading.set(true);
    this.error.set('');

    this.rolesService.getPermissions(undefined, true).subscribe({
      next: (permissions) => {
        this.allPermissions.set(this.buildPermissionRows(permissions));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load permissions. Showing sample data for design preview.');
        this.allPermissions.set(this.buildPermissionRows(this.getFallbackPermissions()));
      }
    });
  }

  private buildPermissionRows(permissions: Permission[]): PermissionView[] {
    return permissions
      .map((permission) => ({
        ...permission,
        permissionName: this.formatPermissionName(permission.name),
        moduleLabel: this.getModuleLabel(permission.module),
        descriptionLabel: permission.description?.trim() || 'No description available.'
      }))
      .sort((a, b) => a.permissionName.localeCompare(b.permissionName));
  }

  private getModuleLabel(moduleKey: string): string {
    const map: Record<string, string> = {
      dashboard: 'Dashboard',
      'core.inventory': 'Inventory Management',
      'core.patients': 'Patient Records',
      'core.sales': 'Sales & POS',
      'analytics.reports': 'Reports & Analytics',
      'core.staff': 'Staff Directory'
    };

    if (map[moduleKey]) {
      return map[moduleKey];
    }

    return moduleKey
      .split('.')
      .slice(-1)[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private getFallbackPermissions(): Permission[] {
    return [
      { id: '1', name: 'inv.view.stock', module: 'core.inventory', action: 'read', isActive: true, description: 'Allows users to view current warehouse stock levels and locations.' },
      { id: '2', name: 'inv.edit.stock', module: 'core.inventory', action: 'update', isActive: true, description: 'Permission to manually adjust quantities and status codes.' },
      { id: '3', name: 'sale.create.order', module: 'core.sales', action: 'create', isActive: true, description: 'Ability to create new customer sales orders and drafts.' },
      { id: '4', name: 'sale.approve.discount', module: 'core.sales', action: 'update', isActive: true, description: 'Managerial permission to approve order discounts over 15%.' },
      { id: '5', name: 'adm.user.mgmt', module: 'core.staff', action: 'update', isActive: true, description: 'Full control over user creation, deletion, and profile management.' },
      { id: '6', name: 'rep.generate.financial', module: 'analytics.reports', action: 'read', isActive: true, description: 'Grant access to high-level financial summary reports and trends.' },
      { id: '7', name: 'qc.verify.batch', module: 'quality.control', action: 'update', isActive: true, description: 'Allows signing off on medical product batches before dispatch.' }
    ];
  }
}
