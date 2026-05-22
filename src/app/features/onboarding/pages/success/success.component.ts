import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-onboarding-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent {
  private state = inject(OnboardingStateService);

  submittedOn = new Date();
  // Application ID is unknown until backend responds.
  // TODO: replace with the real ID returned by submitOnboarding().
  applicationId: string | null = null;

  pharmacyName = this.state.data().basicInfo.pharmacyName;
}
