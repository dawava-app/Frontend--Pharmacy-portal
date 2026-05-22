import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormWrapperComponent } from '../../components/form-wrapper/form-wrapper.component';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-step3-owner-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormWrapperComponent],
  templateUrl: './step3-owner-info.component.html',
  styleUrls: ['./step3-owner-info.component.scss'],
})
export class Step3OwnerInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private state = inject(OnboardingStateService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    fullName:   ['', [Validators.required, Validators.maxLength(120)]],
    nationalId: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(40)]],
    phone:      ['', [Validators.required, Validators.maxLength(30)]],
    email:      ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.form.patchValue(this.state.data().owner);
  }

  onBack(): void {
    this.router.navigate(['/onboarding/step-2']);
  }

  onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.setOwner(this.form.getRawValue());
    this.state.markCompleted(3);
    this.router.navigate(['/onboarding/step-4']);
  }
}