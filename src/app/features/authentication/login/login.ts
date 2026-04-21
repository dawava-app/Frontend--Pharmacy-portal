import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ForgotPasswordModal } from '../forgot-password-modal/forgot-password-modal';
import { ItSupportModal } from '../it-support-modal/it-support-modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ForgotPasswordModal, ItSupportModal],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  showForgotPasswordModal = false;
  showItSupportModal = false;

  private lastSubmitTime = 0;
  private readonly cooldownMs = 2000;
  private readonly branchId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectByRole(this.authService.getRole() || '');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    const now = Date.now();
    if (now - this.lastSubmitTime < this.cooldownMs) {
      return;
    }
    this.lastSubmitTime = now;

    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService
      .loginAndRedirect({
        identifier: email.trim(),
        password: password.trim(),
        branch_id: this.branchId,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.authService.redirectByRole(res.role);
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
        },
      });
  }
}
