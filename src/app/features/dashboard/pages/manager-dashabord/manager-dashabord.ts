// ============================================================
// Manager Dashboard Component
// Path: src/app/features/dashboard/pages/manager-dashabord/manager-dashabord.ts
// ============================================================

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
  signal,
  computed,
  ElementRef,
  viewChild,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DecimalPipe, NgClass } from '@angular/common';
import { Router }                                    from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { AuthService }              from '../../../../core/services/auth.service';
import { ManagerDashboardService }  from '../../services/manager-dashboard.service';
import { DashboardService }         from '../../services/dashboard.service';
import {
  Branch,
  CurrentUser,
  ManagerKpiCard,
  RevenueDataPoint,
  TopMedicine,
  LowStockItem,
  StaffGroup,
  LoadingState,
} from '../../models/dashboard.models';

// ─── Animations ──────────────────────────────────────────────

const dropdownAnimation = trigger('dropdownAnim', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-8px)' }),
    animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' })),
  ]),
]);

const cardAnimation = trigger('cardAnim', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

// ─── Component ───────────────────────────────────────────────

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './manager-dashabord.html',
  styleUrls: ['./manager-dashabord.scss'],
  animations: [dropdownAnimation, cardAnimation],
})
export class ManagerDashboard implements OnInit, OnDestroy {

  // ── DI ────────────────────────────────────────────────────
  private readonly managerSvc  = inject(ManagerDashboardService);
  private readonly dashSvc     = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);
  private readonly platformId  = inject(PLATFORM_ID);

  // ── ViewChild refs (SSR-safe) ─────────────────────────────
  readonly branchDropdownRef = viewChild<ElementRef<HTMLElement>>('branchDropdownRef');
  readonly userMenuRef       = viewChild<ElementRef<HTMLElement>>('userMenuRef');

  // ── Loading / error state ─────────────────────────────────
  readonly loadingState = signal<LoadingState>('idle');
  readonly errorMessage = signal<string | null>(null);

  // ── Data signals ──────────────────────────────────────────
  readonly currentUser     = signal<CurrentUser | null>(null);
  readonly branches        = signal<Branch[]>([]);
  readonly currentBranch   = signal<Branch>({ id: '', name: '—', location: '', address: '' });
  readonly kpiCards        = signal<ManagerKpiCard[]>([]);
  readonly salesData       = signal<RevenueDataPoint[]>([]);
  readonly topMedicines    = signal<TopMedicine[]>([]);
  readonly lowStockItems   = signal<LowStockItem[]>([]);
  readonly staffGroups     = signal<StaffGroup[]>([]);

  // ── Computed helpers ──────────────────────────────────────
  readonly lowStockCount = computed(() => this.lowStockItems().length);

  readonly maxSalesValue = computed(() =>
    Math.max(...this.salesData().map(d => d.value), 1)
  );

  // ── UI state signals ──────────────────────────────────────
  readonly branchDropdownOpen = signal(false);
  readonly userMenuOpen       = signal(false);
  readonly mobileMenuOpen     = signal(false);

  // ── Template-accessible constants ─────────────────────────
  readonly greeting   = this.dashSvc.getGreeting();
  readonly currentYear = new Date().getFullYear();

  // ─────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  ngOnDestroy(): void {
    // Nothing to tear down — services are singleton.
  }

  // ─────────────────────────────────────────────────────────
  // Data loading (public so template retry button can call it)
  // ─────────────────────────────────────────────────────────

  async loadDashboard(): Promise<void> {
    this.loadingState.set('loading');
    this.errorMessage.set(null);

    try {
      // TODO: Pass the real branchId from auth context once available.
      //   const branchId = this.authService.getCurrentUser()?.branchId ?? '';
      const snapshot = await this.managerSvc.getSnapshot();

      this.currentUser.set(snapshot.user);
      this.branches.set(snapshot.branches);
      this.currentBranch.set(
        snapshot.branches.find(b => b.isMain) ?? snapshot.branches[0]
      );
      this.kpiCards.set(snapshot.kpiCards);
      this.salesData.set(snapshot.salesData);
      this.topMedicines.set(snapshot.topMedicines);
      this.lowStockItems.set(snapshot.lowStockItems);
      this.staffGroups.set(snapshot.staffGroups);

      this.loadingState.set('success');
    } catch (err) {
      console.error('[ManagerDashboard] Failed to load snapshot:', err);
      this.errorMessage.set('Failed to load dashboard data. Please refresh.');
      this.loadingState.set('error');
    }
  }

  /** Reloads data for the selected branch. */
  async switchBranch(branch: Branch): Promise<void> {
    this.currentBranch.set(branch);
    this.branchDropdownOpen.set(false);
    // TODO: Pass branch.id to getSnapshot(branch.id) once backend supports filtering.
    await this.loadDashboard();
  }

  /** Sends a restock request for a given low-stock item. */
  async requestRestock(itemName: string): Promise<void> {
    const branchId = this.currentBranch().id;
    try {
      await this.managerSvc.requestRestock(itemName, branchId);
      // TODO: Show success toast notification.
      await this.loadDashboard(); // Refresh after restock
    } catch {
      // TODO: Show error toast notification.
      console.error('[ManagerDashboard] Restock request failed for:', itemName);
    }
  }

  // ─────────────────────────────────────────────────────────
  // UI event handlers
  // ─────────────────────────────────────────────────────────

  toggleBranchDropdown(): void {
    this.branchDropdownOpen.update(v => !v);
    if (this.branchDropdownOpen()) this.userMenuOpen.set(false);
  }

  selectBranch(branch: Branch): void {
    this.switchBranch(branch);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
    if (this.userMenuOpen()) this.branchDropdownOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const branchEl = this.branchDropdownRef()?.nativeElement;
    const userEl   = this.userMenuRef()?.nativeElement;
    const target   = event.target as Node;

    if (this.branchDropdownOpen() && branchEl && !branchEl.contains(target)) {
      this.branchDropdownOpen.set(false);
    }
    if (this.userMenuOpen() && userEl && !userEl.contains(target)) {
      this.userMenuOpen.set(false);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────────────────

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ─────────────────────────────────────────────────────────
  // Template helpers
  // ─────────────────────────────────────────────────────────

  barHeight(value: number): string {
    return `${Math.round((value / this.maxSalesValue()) * 100)}%`;
  }

  trackKpi(_: number, card: ManagerKpiCard): string { return card.id; }
  trackBranch(_: number, b: Branch): string         { return b.id; }
  trackMedicine(_: number, m: TopMedicine): string  { return m.name; }
  trackLowStock(_: number, item: LowStockItem): string { return item.name; }
  trackStaff(_: number, g: StaffGroup): string      { return g.type; }
}
