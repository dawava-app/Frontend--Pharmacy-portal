import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorState } from 'primeng/paginator';
import { Role, RolesService } from '../roles.service';
import { CreateRoleModalComponent } from '../components/create-role-modal/create-role-modal.component';
import { RolesTableComponent } from '../components/roles-table/roles-table.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    RolesTableComponent,
    CreateRoleModalComponent
  ],
  templateUrl: './roles-page.html',
  styleUrl: './roles-page.scss',
})
export class RolesPageComponent implements OnInit {
  private readonly rolesService = inject(RolesService);

  readonly roles = signal<Role[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string>('');
  readonly search = signal<string>('');
  readonly first = signal<number>(0);
  readonly pageSize = signal<number>(5);
  readonly isCreateModalVisible = signal<boolean>(false);
  readonly isCreating = signal<boolean>(false);
  readonly createError = signal<string>('');

  readonly filteredRoles = computed(() => {
    const searchValue = this.search().toLowerCase().trim();
    if (!searchValue) {
      return this.roles();
    }

    return this.roles().filter((role) =>
      role.name.toLowerCase().includes(searchValue) ||
      role.description.toLowerCase().includes(searchValue)
    );
  });

  readonly pagedRoles = computed(() => {
    const start = this.first();
    const end = start + this.pageSize();
    return this.filteredRoles().slice(start, end);
  });

  readonly rangeLabel = computed(() => {
    const count = this.filteredRoles().length;
    const start = count === 0 ? 0 : this.first() + 1;
    const end = Math.min(this.first() + this.pageSize(), count);
    return `Showing ${start} to ${end} of ${count} roles`;
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.first.set(0);
  }

  onPageChange(event: PaginatorState): void {
    if (event.first !== undefined) {
      this.first.set(event.first);
    }
    if (event.rows !== undefined) {
      this.pageSize.set(event.rows);
    }
  }

  openCreateRoleModal(): void {
    this.createError.set('');
    this.isCreateModalVisible.set(true);
  }

  closeCreateRoleModal(): void {
    this.isCreateModalVisible.set(false);
  }

  onCreateRole(payload: { name: string; description: string }): void {
    this.isCreating.set(true);
    this.createError.set('');

    this.rolesService.createRole(payload).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.closeCreateRoleModal();
        this.loadRoles();
      },
      error: () => {
        this.isCreating.set(false);
        this.createError.set('Failed to create role. Please try again.');
      },
    });
  }

  private loadRoles(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.rolesService.getRoles(false).subscribe({
      next: (rolesResponse) => {
        this.roles.set(this.extractRoles(rolesResponse));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Failed to load roles from API. Showing sample data for design preview.');
        this.roles.set(this.getFallbackRoles());
      }
    });
  }

  private extractRoles(response: unknown): Role[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object') {
      const wrapped = response as { data?: unknown; items?: unknown; result?: unknown };

      if (Array.isArray(wrapped.data)) {
        return wrapped.data;
      }

      if (Array.isArray(wrapped.items)) {
        return wrapped.items;
      }

      if (Array.isArray(wrapped.result)) {
        return wrapped.result;
      }
    }

    return [];
  }

  private getFallbackRoles(): Role[] {
    return [
      {
        id: '1',
        name: 'Super Admin',
        description: 'Full system access, audit logs, and global settings',
        createdAt: '2023-10-12T00:00:00Z'
      },
      {
        id: '2',
        name: 'Pharmacist',
        description: 'Can dispense medications, view inventory and process orders',
        createdAt: '2023-11-05T00:00:00Z'
      },
      {
        id: '3',
        name: 'Inventory Manager',
        description: 'Stock level tracking, supplier orders and inventory reports',
        createdAt: '2023-11-15T00:00:00Z'
      },
      {
        id: '4',
        name: 'Sales Associate',
        description: 'Customer transactions, loyalty rewards and order creation',
        createdAt: '2023-12-01T00:00:00Z'
      },
      {
        id: '5',
        name: 'Data Analyst',
        description: 'Read-only access to sales reports, inventory insights and trends',
        createdAt: '2024-01-10T00:00:00Z'
      }
    ];
  }
}
