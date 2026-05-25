import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { BranchRoleAssignment } from '../../branch-role-assignments.service';

@Component({
  selector: 'app-revoke-assignment-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, TextareaModule],
  templateUrl: './revoke-assignment-modal.component.html',
  styleUrl: './revoke-assignment-modal.component.scss',
})
export class RevokeAssignmentModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() assignment: BranchRoleAssignment | null = null;
  @Input() error = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submitRevoke = new EventEmitter<{ reason: string }>();

  readonly reason = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.reason.set('');
    }
  }

  onHide(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const reason = this.reason().trim();
    if (!reason) {
      return;
    }
    this.submitRevoke.emit({ reason });
  }
}
