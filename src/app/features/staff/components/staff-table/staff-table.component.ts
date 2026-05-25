import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import { BranchRoleAssignment } from '../../branch-role-assignments.service';
import { StaffRow } from '../../models/staff-row.model';

@Component({
  selector: 'app-staff-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, PaginatorModule, HugeiconsIconComponent],
  templateUrl: './staff-table.component.html',
  styleUrl: './staff-table.component.scss',
})
export class StaffTableComponent {
  readonly PencilEdit01Icon = PencilEdit01Icon;

  @Input() rows: StaffRow[] = [];
  @Input() isLoading = false;
  @Input() first = 0;
  @Input() pageSize = 5;
  @Input() totalRecords = 0;
  @Input() rangeLabel = '';
  @Output() pageChange = new EventEmitter<PaginatorState>();
  @Output() assignBranch = new EventEmitter<StaffRow>();
  @Output() changeRole = new EventEmitter<{ row: StaffRow; assignment: BranchRoleAssignment }>();

  getDisplayName(row: StaffRow): string {
    return row.user.fullName ?? row.user.name ?? row.user.email ?? 'Unknown user';
  }

  getAssignmentLabel(assignment: BranchRoleAssignment): string {
    const branch = assignment.branchName ?? 'Branch';
    const role = assignment.roleName ?? 'Role';
    return `${branch} · ${role}`;
  }
}
