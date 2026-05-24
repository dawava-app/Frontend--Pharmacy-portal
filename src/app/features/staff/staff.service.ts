import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../app.config';
import {
  Branch,
  BranchesListResponse,
  StaffUser,
  UserDetailResponse,
  UsersListResponse,
  UsersListResult,
  mapBranchesListResponse,
  mapUserDetailResponse,
  mapUsersListResponse,
} from './models/staff-api.responses';

export type { Branch, StaffUser, UsersListResult } from './models/staff-api.responses';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = inject(API_URL);

  getUsers(): Observable<UsersListResult> {
    return this.http
      .get<UsersListResponse>(`${this.apiBase}/admin/users`)
      .pipe(map((response) => mapUsersListResponse(response)));
  }

  getUserById(userId: string): Observable<StaffUser> {
    return this.http
      .get<UserDetailResponse>(`${this.apiBase}/admin/users/${userId}`)
      .pipe(map((response) => mapUserDetailResponse(response)));
  }

  getBranches(): Observable<Branch[]> {
    return this.http
      .get<BranchesListResponse>(`${this.apiBase}/admin/branches`)
      .pipe(map((response) => mapBranchesListResponse(response)));
  }
}
