import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AuthService, ScopeOption } from '../../core/services/auth.service';

@Component({
  selector: 'app-scopes-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scopes-switcher.component.html',
  styleUrl: './scopes-switcher.component.scss',
})
export class ScopesSwitcherComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly scopes = signal<ScopeOption[]>([]);
  readonly currentBranchId = signal('');
  readonly selectedBranchId = signal('');
  readonly isLoading = signal(true);
  readonly isSwitching = signal(false);
  readonly error = signal('');

  readonly currentScope = computed(() =>
    this.scopes().find((scope) => scope.branchId === this.currentBranchId()) ?? null,
  );

  ngOnInit(): void {
    this.loadScopes();
  }

  onBranchChange(branchId: string): void {
    if (!branchId || branchId === this.currentBranchId() || this.isSwitching()) {
      return;
    }

    this.error.set('');
    this.isSwitching.set(true);

    this.authService.switchBranch(branchId).subscribe({
      next: () => {
        this.isSwitching.set(false);
        this.currentBranchId.set(branchId);
        this.selectedBranchId.set(branchId);
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      },
      error: (err: Error) => {
        this.isSwitching.set(false);
        this.selectedBranchId.set(this.currentBranchId());
        this.error.set(err.message || 'Failed to switch branch.');
      },
    });
  }

  scopeLabel(scope: ScopeOption): string {
    if (scope.roleNames.length) {
      return `${scope.branchName} · ${scope.roleNames.join(', ')}`;
    }

    return scope.branchName;
  }

  trackByBranchId(_: number, scope: ScopeOption): string {
    return scope.branchId;
  }

  private loadScopes(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.authService.getScopes().subscribe({
      next: (scopes) => {
        this.scopes.set(scopes);

        const currentScope = scopes.find((scope) => scope.isCurrent) ?? scopes[0] ?? null;
        const currentBranchId = currentScope?.branchId ?? '';

        this.currentBranchId.set(currentBranchId);
        this.selectedBranchId.set(currentBranchId);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Unable to load scopes.');
      },
    });
  }
}