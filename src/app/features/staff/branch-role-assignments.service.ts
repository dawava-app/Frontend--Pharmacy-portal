import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../app.config';
import {
  BranchRoleAssignment,
  BranchRoleAssignmentResponse,
  BranchRoleAssignmentsListResponse,
  CreateBranchRoleAssignmentDto,
  DeleteBranchRoleAssignmentDto,
  UpdateBranchRoleAssignmentDto,
  mapBranchRoleAssignmentResponse,
  mapBranchRoleAssignmentsListResponse,
} from './models/staff-api.responses';

export type UserId = string;
export type AssignmentId = string;

export type {
  BranchRoleAssignment,
  CreateBranchRoleAssignmentDto,
  UpdateBranchRoleAssignmentDto,
  DeleteBranchRoleAssignmentDto,
} from './models/staff-api.responses';

@Injectable({
  providedIn: 'root',
})
export class BranchRoleAssignmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = inject(API_URL);

  getAssignments(userId: UserId): Observable<BranchRoleAssignment[]> {
    return this.http
      .get<BranchRoleAssignmentsListResponse>(
        `${this.apiBase}/admin/users/${userId}/branch-roles`
      )
      .pipe(map((response) => mapBranchRoleAssignmentsListResponse(response)));
  }

  getAssignment(userId: UserId, assignmentId: AssignmentId): Observable<BranchRoleAssignment> {
    return this.http
      .get<BranchRoleAssignmentResponse>(
        `${this.apiBase}/admin/users/${userId}/branch-roles/${assignmentId}`
      )
      .pipe(map((response) => mapBranchRoleAssignmentResponse(response)));
  }

  createAssignment(
    userId: UserId,
    payload: CreateBranchRoleAssignmentDto
  ): Observable<BranchRoleAssignment> {
    return this.http
      .post<BranchRoleAssignmentResponse>(
        `${this.apiBase}/admin/users/${userId}/branch-roles`,
        payload
      )
      .pipe(map((response) => mapBranchRoleAssignmentResponse(response)));
  }

  updateAssignment(
    userId: UserId,
    assignmentId: AssignmentId,
    payload: UpdateBranchRoleAssignmentDto
  ): Observable<BranchRoleAssignment> {
    return this.http
      .put<BranchRoleAssignmentResponse>(
        `${this.apiBase}/admin/users/${userId}/branch-roles/${assignmentId}`,
        payload
      )
      .pipe(map((response) => mapBranchRoleAssignmentResponse(response)));
  }

  deleteAssignment(
    userId: UserId,
    assignmentId: AssignmentId,
    payload: DeleteBranchRoleAssignmentDto
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiBase}/admin/users/${userId}/branch-roles/${assignmentId}`,
      { body: payload }
    );
  }
}
