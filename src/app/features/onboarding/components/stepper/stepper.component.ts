import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ONBOARDING_STEPS } from '../../models/onboarding.models';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-onboarding-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  @Input({ required: true }) currentStep!: number;
  readonly steps = ONBOARDING_STEPS;

  constructor(private state: OnboardingStateService) {}

  isCompleted(stepIndex: number): boolean {
    return this.state.isCompleted(stepIndex) && stepIndex !== this.currentStep;
  }

  isActive(stepIndex: number): boolean {
    return stepIndex === this.currentStep;
  }
}
