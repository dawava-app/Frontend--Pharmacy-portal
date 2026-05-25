import { Injectable, computed, signal } from '@angular/core';
import {
  BranchLocation,
  EMPTY_ONBOARDING,
  OnboardingData,
  OwnerInfo,
  PharmacyBasicInfo,
  UploadedDocument,
} from '../models/onboarding.models';

@Injectable({ providedIn: 'root' })
export class OnboardingStateService {
  /** Single source of truth across all steps. */
  private readonly _data = signal<OnboardingData>(structuredClone(EMPTY_ONBOARDING));
  private readonly _completedSteps = signal<Set<number>>(new Set<number>());

  readonly data = this._data.asReadonly();
  readonly completedSteps = computed(() => Array.from(this._completedSteps()));

  // ---------- Step 1 ----------
  setBasicInfo(info: PharmacyBasicInfo): void {
    this._data.update(d => ({ ...d, basicInfo: { ...info } }));
  }

  // ---------- Step 2 ----------
  setBranches(branches: BranchLocation[]): void {
    // Ensure exactly one main branch
    const hasMain = branches.some(b => b.isMain);
    const normalized = branches.map((b, i) => ({
      ...b,
      isMain: hasMain ? b.isMain : i === 0,
    }));
    this._data.update(d => ({ ...d, branches: normalized }));
  }

  addBranch(): void {
    const blank: BranchLocation = {
      city: '', area: '', address: '', lat: 0, lng: 0, isMain: false,
    };
    this._data.update(d => ({ ...d, branches: [...d.branches, blank] }));
  }

  removeBranch(index: number): void {
    this._data.update(d => {
      const branches = d.branches.filter((_, i) => i !== index);
      if (branches.length && !branches.some(b => b.isMain)) {
        branches[0].isMain = true;
      }
      return { ...d, branches };
    });
  }

  setMainBranch(index: number): void {
    this._data.update(d => ({
      ...d,
      branches: d.branches.map((b, i) => ({ ...b, isMain: i === index })),
    }));
  }

  // ---------- Step 3 ----------
  setOwner(owner: OwnerInfo): void {
    this._data.update(d => ({ ...d, owner: { ...owner } }));
  }

  // ---------- Step 4 ----------
  upsertDocument(doc: UploadedDocument): void {
    this._data.update(d => {
      const others = d.documents.filter(x => x.key !== doc.key);
      return { ...d, documents: [...others, doc] };
    });
  }

  removeDocument(key: string): void {
    this._data.update(d => ({
      ...d,
      documents: d.documents.filter(x => x.key !== key),
    }));
  }

  // ---------- Step tracking ----------
  markCompleted(stepIndex: number): void {
    this._completedSteps.update(set => {
      const next = new Set(set);
      next.add(stepIndex);
      return next;
    });
  }

  isCompleted(stepIndex: number): boolean {
    return this._completedSteps().has(stepIndex);
  }

  reset(): void {
    this._data.set(structuredClone(EMPTY_ONBOARDING));
    this._completedSteps.set(new Set());
  }

  // ---------- Submit ----------
  /**
   * Submits the full onboarding payload.
   *
   * NOTE: API shape, endpoint, headers, and response IDs are intentionally
   * not assumed. Wire this to your backend when it's ready.
   */
  async submitOnboarding(data: OnboardingData = this._data()): Promise<void> {
    // TODO: connect to backend when API is ready.
    // Example (do not assume final shape):
    //
    // return firstValueFrom(
    //   this.http.post(`${environment.apiUrl}/onboarding`, data)
    // );

    // Simulate network latency for UI testing.
    await new Promise(res => setTimeout(res, 600));
    return;
  }
}
