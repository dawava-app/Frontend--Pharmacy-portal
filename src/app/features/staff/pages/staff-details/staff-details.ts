import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';
import { BranchRoleAssignment, BranchRoleAssignmentsService } from '../../branch-role-assignments.service';
import { StaffAssignmentsService } from '../../staff-assignments.service';
import { Branch, StaffService, StaffUser } from '../../staff.service';
import { Role, RolesService } from '../../../roles/roles.service';
import { AssignmentsTableComponent } from '../../components/assignments-table/assignments-table.component';
import { AssignBranchRoleModalComponent } from '../../components/assign-branch-role-modal/assign-branch-role-modal.component';
import { ChangeRoleModalComponent } from '../../components/change-role-modal/change-role-modal.component';
import { RevokeAssignmentModalComponent } from '../../components/revoke-assignment-modal/revoke-assignment-modal.component';

@Component({
  selector: 'app-staff-details-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    ProgressSpinnerModule,
    AssignmentsTableComponent,
    AssignBranchRoleModalComponent,
    ChangeRoleModalComponent,
    RevokeAssignmentModalComponent,
  ],
  templateUrl: './staff-details.html',
  styleUrl: './staff-details.scss',
})
export class StaffDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly staffService = inject(StaffService);
  private readonly assignmentsService = inject(BranchRoleAssignmentsService);
  private readonly staffAssignmentsService = inject(StaffAssignmentsService);
  private readonly rolesService = inject(RolesService);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');
  readonly user = signal<StaffUser | null>(null);
  readonly assignments = signal<BranchRoleAssignment[]>([]);
  readonly branches = signal<Branch[]>([]);
  readonly roles = signal<Role[]>([]);

  readonly isAssignModalVisible = signal<boolean>(false);
  readonly isChangeModalVisible = signal<boolean>(false);
  readonly isRevokeModalVisible = signal<boolean>(false);
  readonly selectedAssignment = signal<BranchRoleAssignment | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly actionError = signal<string>('');
  readonly actionSuccess = signal<string>('');

  private userId = '';

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      this.loading.set(false);
      this.error.set('Invalid staff member identifier.');
      return;
    }

    this.userId = userId;
    this.loadPageData();
  }

  getDisplayName(): string {
    const current = this.user();
    if (!current) {
      return 'Staff member';
    }
    return current.fullName ?? current.name ?? current.email ?? 'Staff member';
  }

  openAssignModal(): void {
    this.actionError.set('');
    this.isAssignModalVisible.set(true);
  }

  closeAssignModal(): void {
    this.isAssignModalVisible.set(false);
  }

  openChangeModal(assignment: BranchRoleAssignment): void {
    this.actionError.set('');
    this.selectedAssignment.set(assignment);
    this.isChangeModalVisible.set(true);
  }

  closeChangeModal(): void {
    this.isChangeModalVisible.set(false);
    this.selectedAssignment.set(null);
  }

  openRevokeModal(assignment: BranchRoleAssignment): void {
    this.actionError.set('');
    this.selectedAssignment.set(assignment);
    this.isRevokeModalVisible.set(true);
  }

  closeRevokeModal(): void {
    this.isRevokeModalVisible.set(false);
    this.selectedAssignment.set(null);
  }

  onAssign(payload: { branchId: string; roleId: string; reason: string }): void {
    this.isSubmitting.set(true);
    this.actionError.set('');
    this.actionSuccess.set('');

    this.staffAssignmentsService
      .assignStaffToBranch(payload.branchId, {
        user_id: this.userId,
        role_id: payload.roleId,
        reason: payload.reason,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeAssignModal();
          this.actionSuccess.set('Branch role assigned successfully.');
          this.loadAssignments();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.actionError.set('Failed to assign branch role. Please try again.');
        },
      });
  }

  onChangeRole(payload: { newRoleId: string; reason: string }): void {
    const assignment = this.selectedAssignment();
    if (!assignment) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set('');
    this.actionSuccess.set('');

    this.assignmentsService
      .updateAssignment(this.userId, assignment.id, payload)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeChangeModal();
          this.actionSuccess.set('Role updated successfully.');
          this.loadAssignments();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.actionError.set('Failed to update role. Please try again.');
        },
      });
  }

  onRevoke(payload: { reason: string }): void {
    const assignment = this.selectedAssignment();
    if (!assignment) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set('');
    this.actionSuccess.set('');

    this.assignmentsService.deleteAssignment(this.userId, assignment.id, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeRevokeModal();
        this.actionSuccess.set('Assignment revoked successfully.');
        this.loadAssignments();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.actionError.set('Failed to revoke assignment. Please try again.');
      },
    });
  }

  private loadPageData(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      user: this.staffService.getUserById(this.userId),
      assignments: this.assignmentsService.getAssignments(this.userId),
      branches: this.staffService.getBranches(),
      roles: this.rolesService.getRoles(false),
    }).subscribe({
      next: ({ user, assignments, branches, roles }) => {
        this.user.set(user);
        this.assignments.set(assignments);
        this.branches.set(branches);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to load staff details. Some data may be unavailable.');
        this.loadAssignments();
        this.loadLookupData();
      },
    });
  }

  private loadAssignments(): void {
    this.assignmentsService.getAssignments(this.userId).subscribe({
      next: (assignments) => this.assignments.set(assignments),
      error: () => this.assignments.set([]),
    });
  }

  private loadLookupData(): void {
    this.staffService.getBranches().subscribe({
      next: (branches) => this.branches.set(branches),
      error: () => this.branches.set([]),
    });

    this.rolesService.getRoles(false).subscribe({
      next: (roles) => this.roles.set(roles),
      error: () => this.roles.set([]),
    });
  }
}
