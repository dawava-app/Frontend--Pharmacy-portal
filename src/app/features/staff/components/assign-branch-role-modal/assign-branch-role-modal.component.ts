import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Branch } from '../../staff.service';
import { Role } from '../../../roles/roles.service';

@Component({
  selector: 'app-assign-branch-role-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, SelectModule, TextareaModule],
  templateUrl: './assign-branch-role-modal.component.html',
  styleUrl: './assign-branch-role-modal.component.scss',
})
export class AssignBranchRoleModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() branches: Branch[] = [];
  @Input() roles: Role[] = [];
  @Input() error = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submitAssignment = new EventEmitter<{
    branchId: string;
    roleId: string;
    reason: string;
  }>();

  readonly selectedBranchId = signal<string | null>(null);
  readonly selectedRoleId = signal<string | null>(null);
  readonly reason = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.clearForm();
    }
  }

  onHide(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const branchId = this.selectedBranchId();
    const roleId = this.selectedRoleId();
    const reason = this.reason().trim();

    if (!branchId || !roleId || !reason) {
      return;
    }

    this.submitAssignment.emit({ branchId, roleId, reason });
  }

  private clearForm(): void {
    this.selectedBranchId.set(null);
    this.selectedRoleId.set(null);
    this.reason.set('');
  }
}
