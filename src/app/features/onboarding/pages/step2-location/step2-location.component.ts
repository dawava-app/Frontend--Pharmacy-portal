import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormWrapperComponent } from '../../components/form-wrapper/form-wrapper.component';
import { BranchLocation } from '../../models/onboarding.models';
import { OnboardingStateService } from '../../services/onboarding-state.service';

@Component({
  selector: 'app-step2-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormWrapperComponent],
  templateUrl: './step2-location.component.html',
  styleUrls: ['./step2-location.component.scss'],
})
export class Step2LocationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private state = inject(OnboardingStateService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    branches: this.fb.array<FormGroup>(
      [],
      [this.minBranchesValidator(1), this.exactlyOneMainValidator()],
    ),
  });

  get branches(): FormArray<FormGroup> {
    return this.form.controls.branches;
  }

  ngOnInit(): void {
    const existing = this.state.data().branches;
    (existing.length ? existing : [this.blankBranch()]).forEach(b =>
      this.branches.push(this.toGroup(b)),
    );
    this.ensureSingleMain();
  }

  private blankBranch(): BranchLocation {
    return { city: '', area: '', address: '', lat: 0, lng: 0, isMain: true };
  }

  private toGroup(b: BranchLocation): FormGroup {
    return this.fb.nonNullable.group({
      city:    [b.city,    Validators.required],
      area:    [b.area,    Validators.required],
      address: [b.address, Validators.required],
      lat:     [b.lat,     [Validators.required, this.nonZeroCoordValidator()]],
      lng:     [b.lng,     [Validators.required, this.nonZeroCoordValidator()]],
      isMain:  [b.isMain],
    });
  }

  /** Coordinate must be a finite number and not exactly 0 (i.e. detected). */
  private nonZeroCoordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) {
        return { required: true };
      }
      if (Number(v) === 0) {
        return { coordinate: true };
      }
      return null;
    };
  }

  /** FormArray must contain at least `min` branches. */
  private minBranchesValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control as FormArray;
      return arr.length >= min ? null : { minBranches: { required: min, actual: arr.length } };
    };
  }

  /** Exactly one branch must be marked as main. */
  private exactlyOneMainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control as FormArray<FormGroup>;
      if (arr.length === 0) return null;
      const mainCount = arr.controls.filter(g => !!g.value?.isMain).length;
      if (mainCount === 0) return { noMain: true };
      if (mainCount > 1) return { multipleMain: true };
      return null;
    };
  }

  /**
   * Add a new blank branch
   */
  addBranch(): void {
    this.branches.push(this.toGroup({
      city: '', area: '', address: '', lat: 0, lng: 0, isMain: false,
    }));
    this.ensureSingleMain();
  }

  /**
   * Remove branch at index and ensure one is marked as main
   */
  removeBranch(i: number): void {
    if (this.branches.length <= 1) return;
    this.branches.removeAt(i);
    this.ensureSingleMain();
  }

  /**
   * Set branch at index as main, unset others
   */
  setMain(i: number): void {
    this.branches.controls.forEach((g, idx) =>
      g.patchValue({ isMain: idx === i }),
    );
    this.branches.updateValueAndValidity();
  }

  /**
   * Ensure exactly one branch is marked as main
   */
  private ensureSingleMain(): void {
    if (!this.branches.length) return;
    const mainIdx = this.branches.controls.findIndex(g => !!g.value?.isMain);
    const target = mainIdx === -1 ? 0 : mainIdx;
    this.branches.controls.forEach((g, idx) =>
      g.patchValue({ isMain: idx === target }),
    );
    this.branches.updateValueAndValidity();
  }

  /**
   * Check if a form field has error and is touched
   */
  isFieldInvalid(branchIndex: number, fieldName: 'city' | 'area' | 'address' | 'lat' | 'lng'): boolean {
    const control = this.branches.at(branchIndex).get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Get error message for a field
   */
  getErrorMessage(branchIndex: number, fieldName: string): string {
    const control = this.branches.at(branchIndex).get(fieldName);
    if (!control || !control.invalid) return '';

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control.hasError('coordinate')) {
      return `${this.getFieldLabel(fieldName)} must be detected`;
    }

    return '';
  }

  /**
   * Get display label for field
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      city: 'City',
      area: 'Area / District',
      address: 'Full Address',
      lat: 'Latitude',
      lng: 'Longitude',
    };
    return labels[fieldName] ?? fieldName;
  }

  /**
   * Check if at least one branch is required
   */
  hasBranchesError(): boolean {
    return this.branches.length === 0;
  }

  /**
   * Simulated geolocation. TODO: integrate real Geolocation API when ready.
   */
  autoDetect(i: number): void {
    // TODO: replace with navigator.geolocation.getCurrentPosition(...)
    const fakeLat = 30.0444 + Math.random() * 0.01;
    const fakeLng = 31.2357 + Math.random() * 0.01;
    const g = this.branches.at(i);
    g.patchValue({ lat: fakeLat, lng: fakeLng });
    g.get('lat')?.markAsTouched();
    g.get('lng')?.markAsTouched();
  }

  /**
   * Simulated map drag. TODO: wire to real map (Leaflet/Mapbox/Google).
   */
  simulateDrag(i: number): void {
    // TODO: bind to real map "dragend" event with marker coords.
    const g = this.branches.at(i);
    const currentLat = Number(g.value.lat) || 30.0444;
    const currentLng = Number(g.value.lng) || 31.2357;
    g.patchValue({
      lat: currentLat + (Math.random() - 0.5) * 0.01,
      lng: currentLng + (Math.random() - 0.5) * 0.01,
    });
    g.get('lat')?.markAsTouched();
    g.get('lng')?.markAsTouched();
  }

  /**
   * Navigate back to previous step
   */
  onBack(): void {
    this.router.navigate(['/onboarding/step-1']);
  }

  /**
   * Navigate to next step if form is valid
   */
  onNext(): void {
    this.form.markAllAsTouched();
    this.branches.updateValueAndValidity();
    this.form.updateValueAndValidity();

    if (this.branches.length === 0 || this.form.invalid || this.branches.invalid) {
      return;
    }
    this.state.setBranches(this.branches.getRawValue() as BranchLocation[]);
    this.state.markCompleted(2);
    this.router.navigate(['/onboarding/step-3']);
  }
}
