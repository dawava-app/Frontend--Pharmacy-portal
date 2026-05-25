import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule, StepperComponent],
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
})
export class FormWrapperComponent {
  @Input({ required: true }) currentStep!: number;
  @Input() title = '';
  @Input() subtitle = '';
}
