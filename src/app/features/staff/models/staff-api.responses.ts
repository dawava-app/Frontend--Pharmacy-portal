/** Standard API envelope used by admin endpoints */
export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
}

export interface StaffUser {
  id: string;
  username?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  isActive?: boolean;
  status?: number;
  isEmailVerified?: boolean;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface BranchRoleAssignment {
  id: string;
  userId?: string;
  branchId: string;
  branchName?: string;
  roleId: string;
  roleName?: string;
  assignedAt?: string;
  isActive?: boolean;
}

export interface CreateBranchRoleAssignmentDto {
  branchId: string;
  roleId: string;
  reason: string;
}

export interface UpdateBranchRoleAssignmentDto {
  newRoleId: string;
  reason: string;
}

export interface DeleteBranchRoleAssignmentDto {
  reason: string;
}

/** POST /pharmacy/branches/:branchId/assign — assign a staff member to a branch with a role */
export interface AssignStaffToBranchDto {
  user_id: string;
  role_id: string;
  reason: string;
}

export type AssignStaffToBranchResponse = BranchRoleAssignmentResponse;

/** GET /admin/users */
export interface UsersListData {
  users: StaffUser[];
  totalCount: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export type UsersListResponse = ApiEnvelope<UsersListData>;

/** GET /admin/users/:id */
export interface UserDetailData {
  user?: StaffUser;
}

export type UserDetailResponse = ApiEnvelope<StaffUser | UserDetailData>;

/** GET /admin/branches */
export interface BranchesListData {
  branches: Branch[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export type BranchesListResponse = ApiEnvelope<BranchesListData | Branch[]>;

/** GET /admin/users/:userId/branch-roles */
export interface BranchRoleAssignmentsListData {
  assignments?: BranchRoleAssignment[];
  branchRoles?: BranchRoleAssignment[];
  branchRoleAssignments?: BranchRoleAssignment[];
}

export type BranchRoleAssignmentsListResponse =
  | ApiEnvelope<BranchRoleAssignmentsListData | BranchRoleAssignment[]>
  | BranchRoleAssignment[];

/** GET/POST/PUT single branch-role assignment */
export interface BranchRoleAssignmentData {
  assignment?: BranchRoleAssignment;
  branchRole?: BranchRoleAssignment;
}

export type BranchRoleAssignmentResponse =
  | ApiEnvelope<BranchRoleAssignment | BranchRoleAssignmentData>
  | BranchRoleAssignment;

export interface UsersListResult {
  users: StaffUser[];
  totalCount: number;
}

export function mapUsersListResponse(response: UsersListResponse | StaffUser[]): UsersListResult {
  if (Array.isArray(response)) {
    return { users: response, totalCount: response.length };
  }

  const data = response.data;
  if (!data) {
    return { users: [], totalCount: 0 };
  }

  return {
    users: data.users,
    totalCount: data.totalCount ?? data.users.length,
  };
}

export function mapUserDetailResponse(response: UserDetailResponse): StaffUser {
  const data = response.data;
  if (!data) {
    throw new Error('User not found in API response.');
  }

  if ('user' in data && data.user) {
    return data.user;
  }

  return data as StaffUser;
}

export function mapBranchesListResponse(response: BranchesListResponse): Branch[] {
  if (Array.isArray(response)) {
    return response;
  }

  const data = response.data;
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.branches ?? [];
}

export function mapBranchRoleAssignmentsListResponse(
  response: BranchRoleAssignmentsListResponse
): BranchRoleAssignment[] {
  if (Array.isArray(response)) {
    return response;
  }

  const data = response.data;
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return (
    data.assignments ??
    data.branchRoles ??
    data.branchRoleAssignments ??
    []
  );
}

export function mapBranchRoleAssignmentResponse(
  response: BranchRoleAssignmentResponse
): BranchRoleAssignment {
  if ('id' in response && 'branchId' in response && 'roleId' in response) {
    return response;
  }

  const data = response.data;
  if (!data) {
    throw new Error('Assignment not found in API response.');
  }

  if ('assignment' in data && data.assignment) {
    return data.assignment;
  }

  if ('branchRole' in data && data.branchRole) {
    return data.branchRole;
  }

  return data as BranchRoleAssignment;
}
