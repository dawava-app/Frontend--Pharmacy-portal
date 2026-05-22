// Generic, flexible models. Backend shape is unknown — keep optional fields optional.

export interface PharmacyBasicInfo {
  pharmacyName: string;
  phone: string;
  email: string;
}

export interface BranchLocation {
  city: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  isMain: boolean;
}

export interface OwnerInfo {
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
}

export interface UploadedDocument {
  /** Logical slot, e.g. "pharmacyLicense", "ownerId" */
  key: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
  /** Local-only reference until uploaded to backend */
  file?: File;
  /** Filled after backend upload */
  remoteUrl?: string;
}

export interface OnboardingData {
  basicInfo: PharmacyBasicInfo;
  branches: BranchLocation[];
  owner: OwnerInfo;
  documents: UploadedDocument[];
}

export const EMPTY_ONBOARDING: OnboardingData = {
  basicInfo: { pharmacyName: '', phone: '', email: '' },
  branches: [
    { city: '', area: '', address: '', lat: 0, lng: 0, isMain: true },
  ],
  owner: { fullName: '', nationalId: '', phone: '', email: '' },
  documents: [],
};

export interface OnboardingStepMeta {
  index: number;       // 1..5
  label: string;
  route: string;       // e.g. 'step-1'
}

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { index: 1, label: 'Basic Info',  route: 'step-1' },
  { index: 2, label: 'Location',    route: 'step-2' },
  { index: 3, label: 'Owner',       route: 'step-3' },
  { index: 4, label: 'Documents',   route: 'step-4' },
  { index: 5, label: 'Review',      route: 'step-5' },
];
