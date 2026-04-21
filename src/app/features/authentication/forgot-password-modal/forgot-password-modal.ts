import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

type ForgotStep = 'email' | 'otp' | 'newPassword' | 'success';

const strongPasswordValidator: ValidatorFn = (control: AbstractControl) => {
  const value = control.value || '';
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  return hasUpper && hasLower && hasNumber && hasSpecial && value.length >= 8
    ? null
    : { weakPassword: true };
};

const passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
  return group.get('newPassword')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };
};

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-modal.html',
  styleUrl: './forgot-password-modal.scss',
})
export class ForgotPasswordModal {
  @Output() closeModal = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private countdownSub: Subscription | null = null;

  currentStep: ForgotStep = 'email';
  isLoading = false;
  errorMessage = '';
  resendCountdown = 0;
  submittedEmail = '';
  resetToken = '';
  otpDigits = ['', '', '', '', '', ''];
  showNewPassword = false;
  showConfirmPassword = false;

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  passwordForm: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  onSubmitEmail(): void {
    this.emailForm.markAllAsTouched();
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.submittedEmail = this.emailForm.value.email.trim();
    this.http.post('/api/auth/forgot-password/request-otp', { email: this.submittedEmail }).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentStep = 'otp';
        this.startResendCountdown();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to send OTP.';
      },
    });
  }

  onSubmitOtp(): void {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;
    this.isLoading = true;
    this.http
      .post<{ reset_token?: string; token?: string }>('/api/auth/forgot-password/verify-otp', {
        email: this.submittedEmail,
        otp_code: this.otpForm.value.otp.trim(),
      })
      .subscribe({
        next: (res) => {
          this.resetToken = res?.reset_token || res?.token || '';
          this.isLoading = false;
          this.currentStep = 'newPassword';
          this.stopCountdown();
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Invalid OTP.';
        },
      });
  }

  onSubmitPassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.http
      .post('/api/auth/forgot-password/reset', {
        reset_token: this.resetToken,
        new_password: this.passwordForm.value.newPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.currentStep = 'success';
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Password reset failed.';
        },
      });
  }

  resendOtp(): void {
    if (this.resendCountdown > 0) return;
    this.onSubmitEmail();
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(-1);
    this.otpDigits[index] = value;
    this.otpForm.patchValue({ otp: this.otpDigits.join('') });
    if (value && index < 5) {
      (document.getElementById(`otp-box-${index + 1}`) as HTMLInputElement | null)?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      (document.getElementById(`otp-box-${index - 1}`) as HTMLInputElement | null)?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    digits.forEach((d, i) => (this.otpDigits[i] = d));
    this.otpForm.patchValue({ otp: this.otpDigits.join('') });
  }

  close(): void {
    this.stopCountdown();
    this.closeModal.emit();
  }

  private startResendCountdown(): void {
    this.stopCountdown();
    this.resendCountdown = 300;
    this.countdownSub = interval(1000)
      .pipe(take(300))
      .subscribe(() => {
        this.resendCountdown--;
      });
  }

  private stopCountdown(): void {
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
  }
}
