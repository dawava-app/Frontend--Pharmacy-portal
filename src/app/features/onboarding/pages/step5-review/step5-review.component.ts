import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormWrapperComponent } from '../../components/form-wrapper/form-wrapper.component';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-step5-review',
  standalone: true,
  imports: [CommonModule, FormWrapperComponent],
  templateUrl: './step5-review.component.html',
  styleUrls: ['./step5-review.component.scss'],
})
export class Step5ReviewComponent {
  private state = inject(OnboardingStateService);
  private router = inject(Router);

  data = this.state.data;
  submitting = signal(false);

  get mainBranch() {
    return this.data().branches.find(b => b.isMain) ?? this.data().branches[0];
  }

  onBack(): void { this.router.navigate(['/onboarding/step-4']); }
  edit(stepRoute: string): void { this.router.navigate(['/onboarding', stepRoute]); }

  async submit(): Promise<void> {
    if (this.submitting()) return;
    this.submitting.set(true);
    try {
      // TODO: connect to backend when API is ready.
      await this.state.submitOnboarding();
      this.state.markCompleted(5);
      this.router.navigate(['/onboarding/success']);
    } finally {
      this.submitting.set(false);
    }
  }
}
