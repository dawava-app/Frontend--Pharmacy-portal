import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Role } from '../../../roles/roles.service';
import { BranchRoleAssignment } from '../../branch-role-assignments.service';

@Component({
  selector: 'app-change-role-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, SelectModule, TextareaModule],
  templateUrl: './change-role-modal.component.html',
  styleUrl: './change-role-modal.component.scss',
})
export class ChangeRoleModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() assignment: BranchRoleAssignment | null = null;
  @Input() roles: Role[] = [];
  @Input() error = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<{ newRoleId: string; reason: string }>();

  readonly selectedRoleId = signal<string | null>(null);
  readonly reason = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.selectedRoleId.set(this.assignment?.roleId ?? null);
      this.reason.set('');
    }
  }

  onHide(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const newRoleId = this.selectedRoleId();
    const reason = this.reason().trim();

    if (!newRoleId || !reason) {
      return;
    }

    this.submitChange.emit({ newRoleId, reason });
  }
}
