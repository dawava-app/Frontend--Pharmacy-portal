import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Permission, Role, RolesService } from '../../roles.service';
import { Router } from '@angular/router';
import EyeIcon from '@hugeicons/core-free-icons/EyeIcon';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import { HugeiconsIconComponent } from '@hugeicons/angular';
@Component({
  selector: 'app-roles-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, PaginatorModule, HugeiconsIconComponent],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.scss',
})
export class RolesTableComponent implements OnChanges {

  EyeIcon = EyeIcon;
  PencilEdit01Icon = PencilEdit01Icon;
  Delete02Icon = Delete02Icon;
  @Input() roles: Role[] = [];
  @Input() isLoading = false;
  @Input() first = 0;
  @Input() pageSize = 5;
  @Input() totalRecords = 0;
  @Input() rangeLabel = '';
  @Output() pageChange = new EventEmitter<PaginatorState>();

  private permissionMap: Record<string, Permission[]> = {};

  constructor(
    private readonly rolesService: RolesService,
    private readonly router: Router
  ) {}

  ngOnChanges(): void {
    for (const role of this.roles) {
      if (this.permissionMap[role.id]) {
        continue;
      }

      this.rolesService.getRolePermissions(role.id).subscribe({
        next: (permissions) => {
          this.permissionMap = { ...this.permissionMap, [role.id]: permissions };
        },
        error: () => {
          this.permissionMap = { ...this.permissionMap, [role.id]: [] };
        },
      });
    }
  }

  getPermissionCount(roleId: string): number {
    return this.permissionMap[roleId]?.length ?? 0;
  }

  getCreatedAtLabel(createdAt?: string): string {
    if (!createdAt) {
      return '-';
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(createdAt));
  }

  openRoleDetails(roleId: string): void {
    this.router.navigate(['/roles', roleId]);
  }
}
