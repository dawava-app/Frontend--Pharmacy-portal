import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormWrapperComponent } from '../../components/form-wrapper/form-wrapper.component';
import { UploadedDocument } from '../../models/onboarding.models';
import { OnboardingStateService } from '../../services/onboarding-state.service';

interface DocumentSlot {
  key: string;
  label: string;
  hint: string;
}

interface ErrorState {
  slotKey: string;
  type: 'invalid-type' | 'size-exceeded' | null;
  message: string;
}

@Component({
  selector: 'app-step4-documents',
  standalone: true,
  imports: [CommonModule, FormWrapperComponent],
  templateUrl: './step4-documents.component.html',
  styleUrls: ['./step4-documents.component.scss'],
})
export class Step4DocumentsComponent {
  private state = inject(OnboardingStateService);
  private router = inject(Router);

  private readonly MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  private readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  private readonly ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

  readonly slots: DocumentSlot[] = [
    { key: 'pharmacyLicense', label: 'Pharmacy License', hint: 'PDF, JPG or PNG (max. 10MB)' },
    { key: 'ownerId', label: 'Owner ID / Passport', hint: 'PDF, JPG or PNG (max. 10MB)' },
  ];

  documents = this.state.data;
  dragOverKey = signal<string | null>(null);
  errors = signal<Map<string, ErrorState>>(new Map());

  // =========================
  // VALIDATION
  // =========================

  private validateFile(file: File): { valid: boolean; errorType?: 'invalid-type' | 'size-exceeded'; message?: string } {
    const isValidType =
      this.ALLOWED_TYPES.includes(file.type) ||
      this.ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      return {
        valid: false,
        errorType: 'invalid-type',
        message: 'Invalid file type. Only PDF, JPG, and PNG are allowed.',
      };
    }

    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        errorType: 'size-exceeded',
        message: `File size exceeds 10MB limit.`,
      };
    }

    return { valid: true };
  }

  // =========================
  // FILE HANDLING
  // =========================

  private processFile(slot: DocumentSlot, file: File): void {
    const validation = this.validateFile(file);

    if (!validation.valid) {
      this.setError(slot.key, validation.errorType!, validation.message!);
      return;
    }

    const errors = this.errors();
    errors.delete(slot.key);
    this.errors.set(new Map(errors));

    const doc: UploadedDocument = {
      key: slot.key,
      fileName: file.name,
      sizeBytes: file.size,
      mimeType: file.type,
      file,
    };

    this.state.upsertDocument(doc);
  }

  onFile(slot: DocumentSlot, evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.processFile(slot, file);
    input.value = '';
  }

  onDrop(slot: DocumentSlot, evt: DragEvent): void {
    evt.preventDefault();
    this.dragOverKey.set(null);

    const file = evt.dataTransfer?.files?.[0];
    if (!file) return;

    this.processFile(slot, file);
  }

  onDragOver(slotKey: string, evt: DragEvent): void {
    evt.preventDefault();
    this.dragOverKey.set(slotKey);
  }

  onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    this.dragOverKey.set(null);
  }

  // =========================
  // ERROR HANDLING
  // =========================

  private setError(slotKey: string, type: any, message: string): void {
    const errors = this.errors();
    errors.set(slotKey, { slotKey, type, message });
    this.errors.set(new Map(errors));
  }

  hasError(slotKey: string): boolean {
    return this.errors().has(slotKey);
  }

  getError(slotKey: string): ErrorState | undefined {
    return this.errors().get(slotKey);
  }

  // =========================
  // HELPERS
  // =========================

  uploadedFor(key: string): UploadedDocument | undefined {
    return this.documents().documents.find(d => d.key === key);
  }

  removeDoc(key: string): void {
    this.state.removeDocument(key);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // =========================
  // NAVIGATION (🔥 FIXED)
  // =========================

  private hasAllRequiredDocuments(): boolean {
    const docs = this.documents().documents;
    return this.slots.every(slot =>
      docs.some(d => d.key === slot.key)
    );
  }

  onBack(): void {
    this.router.navigate(['/onboarding/step-3']);
  }

  onNext(): void {
    // 🔴 HARD GUARD (MAIN FIX)
    if (!this.hasAllRequiredDocuments()) {
      alert('Please upload all required documents before continuing.');
      return;
    }

    this.state.markCompleted(4);
    this.router.navigate(['/onboarding/step-5']);
  }
}