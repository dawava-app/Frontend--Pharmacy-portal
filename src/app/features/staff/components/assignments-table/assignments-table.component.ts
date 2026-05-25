import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import { BranchRoleAssignment } from '../../branch-role-assignments.service';

@Component({
  selector: 'app-assignments-table',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, HugeiconsIconComponent],
  templateUrl: './assignments-table.component.html',
  styleUrl: './assignments-table.component.scss',
})
export class AssignmentsTableComponent {
  readonly PencilEdit01Icon = PencilEdit01Icon;
  readonly Delete02Icon = Delete02Icon;

  @Input() assignments: BranchRoleAssignment[] = [];
  @Input() isLoading = false;
  @Output() changeRole = new EventEmitter<BranchRoleAssignment>();
  @Output() revoke = new EventEmitter<BranchRoleAssignment>();

  getAssignedAtLabel(assignedAt?: string): string {
    if (!assignedAt) {
      return '-';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(assignedAt));
  }
}
