import { Routes } from '@angular/router';

export const ONBOARDING_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'step-1' },
  {
    path: 'step-1',
    loadComponent: () =>
      import('./pages/step1-basic-info/step1-basic-info.component')
        .then(m => m.Step1BasicInfoComponent),
  },
  {
    path: 'step-2',
    loadComponent: () =>
      import('./pages/step2-location/step2-location.component')
        .then(m => m.Step2LocationComponent),
  },
  {
    path: 'step-3',
    loadComponent: () =>
      import('./pages/step3-owner-info/step3-owner-info.component')
        .then(m => m.Step3OwnerInfoComponent),
  },
  {
    path: 'step-4',
    loadComponent: () =>
      import('./pages/step4-documents/step4-documents.component')
        .then(m => m.Step4DocumentsComponent),
  },
  {
    path: 'step-5',
    loadComponent: () =>
      import('./pages/step5-review/step5-review.component')
        .then(m => m.Step5ReviewComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./pages/success/success.component')
        .then(m => m.SuccessComponent),
  },
];
