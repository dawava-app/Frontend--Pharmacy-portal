import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../app.config';
import {
  AssignStaffToBranchDto,
  AssignStaffToBranchResponse,
  BranchRoleAssignment,
  mapBranchRoleAssignmentResponse,
} from './models/staff-api.responses';

export type { AssignStaffToBranchDto } from './models/staff-api.responses';

/**
 * Pharmacy-scoped staff assignment API.
 * Assigns users to branches from the branch perspective (branch in URL, user in body).
 */
@Injectable({
  providedIn: 'root',
})
export class StaffAssignmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = inject(API_URL);

  /**
   * Assign a staff member to a pharmacy branch with a given role.
   * POST /pharmacy/branches/{branchId}/assign
   */
  assignStaffToBranch(
    branchId: string,
    payload: AssignStaffToBranchDto
  ): Observable<BranchRoleAssignment> {
    return this.http
      .post<AssignStaffToBranchResponse>(
        `${this.apiBase}/pharmacy/branches/${branchId}/assign`,
        payload
      )
      .pipe(map((response) => mapBranchRoleAssignmentResponse(response)));
  }
}
