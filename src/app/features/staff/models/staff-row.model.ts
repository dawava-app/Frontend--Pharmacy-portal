import { BranchRoleAssignment } from '../branch-role-assignments.service';
import { StaffUser } from '../staff.service';

export interface StaffRow {
  user: StaffUser;
  assignments: BranchRoleAssignment[];
}
