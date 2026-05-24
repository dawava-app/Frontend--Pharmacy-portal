import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorState } from 'primeng/paginator';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Branch, StaffService, StaffUser } from '../../staff.service';
import { StaffTableComponent } from '../../components/staff-table/staff-table.component';
import { StaffRow } from '../../models/staff-row.model';
import { BranchRoleAssignment, BranchRoleAssignmentsService } from '../../branch-role-assignments.service';
import { StaffAssignmentsService } from '../../staff-assignments.service';
import { Role, RolesService } from '../../../roles/roles.service';
import { AssignBranchRoleModalComponent } from '../../components/assign-branch-role-modal/assign-branch-role-modal.component';
import { ChangeRoleModalComponent } from '../../components/change-role-modal/change-role-modal.component';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    StaffTableComponent,
    AssignBranchRoleModalComponent,
    ChangeRoleModalComponent,
  ],
  templateUrl: './staff-page.html',
  styleUrl: './staff-page.scss',
})
export class StaffPageComponent implements OnInit {
  private readonly staffService = inject(StaffService);
  private readonly assignmentsService = inject(BranchRoleAssignmentsService);
  private readonly staffAssignmentsService = inject(StaffAssignmentsService);
  private readonly rolesService = inject(RolesService);

  readonly rows = signal<StaffRow[]>([]);
  readonly branches = signal<Branch[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string>('');
  readonly search = signal<string>('');
  readonly first = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly totalCount = signal<number>(0);

  readonly isAssignModalVisible = signal<boolean>(false);
  readonly isChangeModalVisible = signal<boolean>(false);
  readonly selectedRow = signal<StaffRow | null>(null);
  readonly selectedAssignment = signal<BranchRoleAssignment | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly actionError = signal<string>('');
  readonly actionSuccess = signal<string>('');

  readonly filteredRows = computed(() => {
    const searchValue = this.search().toLowerCase().trim();
    if (!searchValue) {
      return this.rows();
    }

    return this.rows().filter((row) => {
      const name = (row.user.fullName ?? row.user.name ?? '').toLowerCase();
      const email = (row.user.email ?? '').toLowerCase();
      const username = (row.user.username ?? '').toLowerCase();
      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        username.includes(searchValue)
      );
    });
  });

  readonly pagedRows = computed(() => {
    const start = this.first();
    const end = start + this.pageSize();
    return this.filteredRows().slice(start, end);
  });

  readonly rangeLabel = computed(() => {
    const count = this.filteredRows().length;
    const start = count === 0 ? 0 : this.first() + 1;
    const end = Math.min(this.first() + this.pageSize(), count);
    return `Showing ${start} to ${end} of ${count} staff`;
  });

  ngOnInit(): void {
    this.loadStaff();
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

  openAssignModal(row: StaffRow): void {
    this.actionError.set('');
    this.actionSuccess.set('');
    this.selectedRow.set(row);
    this.isAssignModalVisible.set(true);
  }

  closeAssignModal(): void {
    this.isAssignModalVisible.set(false);
    this.selectedRow.set(null);
  }

  openChangeModal(payload: { row: StaffRow; assignment: BranchRoleAssignment }): void {
    this.actionError.set('');
    this.actionSuccess.set('');
    this.selectedRow.set(payload.row);
    this.selectedAssignment.set(payload.assignment);
    this.isChangeModalVisible.set(true);
  }

  closeChangeModal(): void {
    this.isChangeModalVisible.set(false);
    this.selectedAssignment.set(null);
    this.selectedRow.set(null);
  }

  onAssign(payload: { branchId: string; roleId: string; reason: string }): void {
    const row = this.selectedRow();
    if (!row) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set('');

    this.staffAssignmentsService
      .assignStaffToBranch(payload.branchId, {
        user_id: row.user.id,
        role_id: payload.roleId,
        reason: payload.reason,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.closeAssignModal();
          this.actionSuccess.set('Branch role assigned successfully.');
          this.refreshRowAssignments(row.user.id);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.actionError.set('Failed to assign branch role.');
        },
      });
  }

  onChangeRole(payload: { newRoleId: string; reason: string }): void {
    const row = this.selectedRow();
    const assignment = this.selectedAssignment();
    if (!row || !assignment) {
      return;
    }

    this.isSubmitting.set(true);
    this.actionError.set('');

    this.assignmentsService.updateAssignment(row.user.id, assignment.id, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeChangeModal();
        this.actionSuccess.set('Role updated successfully.');
        this.refreshRowAssignments(row.user.id);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.actionError.set('Failed to update role.');
      },
    });
  }

  private loadStaff(): void {
    this.isLoading.set(true);
    this.error.set('');

    forkJoin({
      usersList: this.staffService.getUsers(),
      branches: this.staffService.getBranches().pipe(catchError(() => of([] as Branch[]))),
      roles: this.rolesService.getRoles(false).pipe(catchError(() => of([] as Role[]))),
    }).subscribe({
      next: ({ usersList, branches, roles }) => {
        this.branches.set(branches);
        this.roles.set(roles);
        this.totalCount.set(usersList.totalCount);

        const { users } = usersList;
        if (!users.length) {
          this.rows.set([]);
          this.isLoading.set(false);
          return;
        }

        forkJoin(
          users.map((user) =>
            this.assignmentsService.getAssignments(user.id).pipe(
              map((assignments) => ({
                user,
                assignments: this.enrichAssignments(assignments),
              })),
              catchError(() => of({ user, assignments: [] as BranchRoleAssignment[] }))
            )
          )
        ).subscribe({
          next: (staffRows) => {
            this.rows.set(staffRows);
            this.isLoading.set(false);
          },
          error: () => {
            this.rows.set(users.map((user) => ({ user, assignments: [] })));
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Failed to load staff. Please try again.');
        this.rows.set([]);
      },
    });
  }

  private refreshRowAssignments(userId: string): void {
    this.assignmentsService.getAssignments(userId).subscribe({
      next: (assignments) => {
        this.rows.update((rows) =>
          rows.map((row) =>
            row.user.id === userId
              ? { ...row, assignments: this.enrichAssignments(assignments) }
              : row
          )
        );
      },
    });
  }

  private enrichAssignments(assignments: BranchRoleAssignment[]): BranchRoleAssignment[] {
    const branchMap = new Map(this.branches().map((branch) => [branch.id, branch.name]));
    const roleMap = new Map(this.roles().map((role) => [role.id, role.name]));

    return assignments.map((assignment) => ({
      ...assignment,
      branchName: assignment.branchName ?? branchMap.get(assignment.branchId),
      roleName: assignment.roleName ?? roleMap.get(assignment.roleId),
    }));
  }
}
