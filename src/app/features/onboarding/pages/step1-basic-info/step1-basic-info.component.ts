import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormWrapperComponent } from '../../components/form-wrapper/form-wrapper.component';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-step1-basic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormWrapperComponent],
  templateUrl: './step1-basic-info.component.html',
  styleUrls: ['./step1-basic-info.component.scss'],
})
export class Step1BasicInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private state = inject(OnboardingStateService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    pharmacyName: ['', [Validators.required, Validators.maxLength(120)]],
    phone:        ['', [Validators.required, Validators.maxLength(30)]],
    email:        ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.form.patchValue(this.state.data().basicInfo);
  }

  /**
   * Get error message for a form field
   */
  getErrorMessage(controlName: 'pharmacyName' | 'phone' | 'email'): string {
    const control = this.form.get(controlName);
    if (!control || !control.invalid || !control.touched) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }

    if (controlName === 'email' && control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `${this.getFieldLabel(controlName)} cannot exceed ${maxLength} characters`;
    }

    return '';
  }

  /**
   * Get display label for field
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      pharmacyName: 'Pharmacy Name',
      phone: 'Phone',
      email: 'Email',
    };
    return labels[fieldName];
  }

  /**
   * Check if field has error and is touched
   */
  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Navigate to next step only if form is valid
   */
  onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.state.setBasicInfo(this.form.getRawValue());
    this.state.markCompleted(1);
    this.router.navigate(['/onboarding/step-2']);
  }
}
