import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-role-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, InputTextModule, TextareaModule],
  templateUrl: './create-role-modal.component.html',
  styleUrl: './create-role-modal.component.scss',
})
export class CreateRoleModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() error = '';
  @Output() cancel = new EventEmitter<void>();
  @Output() submitRole = new EventEmitter<{ name: string; description: string }>();

  readonly roleName = signal('');
  readonly roleDescription = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.clearForm();
    }
  }

  onHide(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    const name = this.roleName().trim();
    const description = this.roleDescription().trim();
    if (!name || !description) {
      return;
    }

    this.submitRole.emit({ name, description });
  }

  clearForm(): void {
    this.roleName.set('');
    this.roleDescription.set('');
  }
}
