import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-it-support-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './it-support-modal.html',
  styleUrl: './it-support-modal.scss',
})
export class ItSupportModal {
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  openMail(): void {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:it-support@dawava.com';
    }
  }
}
