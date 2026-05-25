// ============================================================
// Staff Dashboard Component
// Path: src/app/features/dashboard/pages/stuff-dashbaord/staff-dashboard.ts
// ============================================================

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive }      from '@angular/router';
import { AuthService }             from '../../../../core/services/auth.service';
import { StaffDashboardService }   from '../../services/staff-dashboard.service';
import { DashboardService }        from '../../services/dashboard.service';
import {
  CurrentUser,
  StaffKpiCard,
  WeeklyBarData,
  StockAlert,
  SearchedItem,
  InventoryStatus,
  LoadingState,
} from '../../models/dashboard.models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './staff-dashboard.html',
  styleUrls: ['./staff-dashboard.scss'],
})
export class StaffDashboard implements OnInit, OnDestroy {

  // ── DI ────────────────────────────────────────────────────
  private readonly staffSvc    = inject(StaffDashboardService);
  private readonly dashSvc     = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);
  private readonly platformId  = inject(PLATFORM_ID);

  // ── Loading / error state ─────────────────────────────────
  readonly loadingState = signal<LoadingState>('idle');
  readonly errorMessage = signal<string | null>(null);

  // ── Data signals ──────────────────────────────────────────
  readonly currentUser     = signal<CurrentUser | null>(null);
  readonly kpiCards        = signal<StaffKpiCard[]>([]);
  readonly weeklyData      = signal<WeeklyBarData[]>([]);
  readonly stockAlerts     = signal<StockAlert[]>([]);
  readonly topSearched     = signal<SearchedItem[]>([]);
  readonly inventoryStatus = signal<InventoryStatus>({ total: 0, inStockPct: 0, lowStockPct: 0, criticalPct: 0 });
  readonly branchAddress   = signal<string>('—');

  // ── Computed helpers ──────────────────────────────────────

  /** First name of the current user (for the greeting). */
  readonly firstName = computed(() => {
    const name = this.currentUser()?.name ?? '';
    return name.split(' ')[0] || 'Staff';
  });

  /**
   * SVG donut chart dash-array values computed from inventoryStatus signal.
   * Circumference of r=45 circle ≈ 282.74. We divide it by 100 to get 1% = 2.8274px.
   */
  readonly donutSegments = computed(() => {
    const status = this.inventoryStatus();
    const circ = 282.74; // 2π × 45
    const inStock  = (status.inStockPct  / 100) * circ;
    const lowStock = (status.lowStockPct / 100) * circ;
    const critical = (status.criticalPct / 100) * circ;
    const rest     = circ;

    return {
      inStock:  { array: `${inStock.toFixed(0)} ${(circ - inStock).toFixed(0)}`,  offset: '0'                            },
      lowStock: { array: `${lowStock.toFixed(0)} ${(circ - lowStock).toFixed(0)}`, offset: `-${inStock.toFixed(0)}`       },
      critical: { array: `${critical.toFixed(0)} ${(circ - critical).toFixed(0)}`,offset: `-${(inStock + lowStock).toFixed(0)}` },
    };
  });

  // ── UI state ──────────────────────────────────────────────
  isProfileDropdownOpen = false;

  // ── Constants ─────────────────────────────────────────────
  readonly greeting = this.dashSvc.getGreeting();

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
      const snapshot = await this.staffSvc.getSnapshot();

      this.currentUser.set(snapshot.user);
      this.kpiCards.set(snapshot.kpiCards);
      this.weeklyData.set(snapshot.weeklyData);
      this.stockAlerts.set(snapshot.stockAlerts);
      this.topSearched.set(snapshot.topSearched);
      this.inventoryStatus.set(snapshot.inventoryStatus);
      this.branchAddress.set(snapshot.branchAddress);

      this.loadingState.set('success');
    } catch (err) {
      console.error('[StaffDashboard] Failed to load snapshot:', err);
      this.errorMessage.set('Failed to load dashboard data. Please refresh.');
      this.loadingState.set('error');
    }
  }

  /** Sends a restock request for a given alert item. */
  async requestRestock(medicineName: string): Promise<void> {
    const branchId = this.currentUser()?.branchId ?? '';
    try {
      await this.staffSvc.requestRestock(medicineName, branchId);
      // TODO: Show success toast notification.
      await this.loadDashboard(); // Refresh after restock
    } catch {
      console.error('[StaffDashboard] Restock request failed for:', medicineName);
    }
  }

  // ─────────────────────────────────────────────────────────
  // UI event handlers
  // ─────────────────────────────────────────────────────────

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  /**
   * Closes the profile dropdown when clicking outside.
   * The template uses (click)="$event.stopPropagation()" on the
   * dropdown so only outside clicks reach this listener.
   */
  @HostListener('document:click')
  onDocumentClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isProfileDropdownOpen) this.closeProfileDropdown();
  }

  // ─────────────────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────────────────

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ─────────────────────────────────────────────────────────
  // Track-by helpers
  // ─────────────────────────────────────────────────────────

  trackKpi(_: number, card: StaffKpiCard): string     { return card.id; }
  trackBar(_: number, bar: WeeklyBarData): string     { return bar.label; }
  trackAlert(_: number, a: StockAlert): string        { return a.name; }
  trackSearch(_: number, s: SearchedItem): string     { return s.name; }
}
