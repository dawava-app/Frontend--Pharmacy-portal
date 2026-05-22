// ============================================================
// Staff Dashboard Service
// Path: src/app/features/dashboard/services/staff-dashboard.service.ts
// Purpose: Provides all data for the Staff Dashboard.
//
//   ┌── MOCK MODE (current) ──────────────────────────────────┐
//   │  Returns static data via Promises with simulated delay. │
//   │  Swap each method for a real HttpClient call when the   │
//   │  backend is ready (see TODO comments per method).       │
//   └─────────────────────────────────────────────────────────┘
// ============================================================

import { Injectable, inject }                from '@angular/core';
import { HttpClient }                         from '@angular/common/http';
import { firstValueFrom }                     from 'rxjs';
import {
  StaffDashboardSnapshot,
  StaffKpiCard,
  WeeklyBarData,
  StockAlert,
  SearchedItem,
  InventoryStatus,
  CurrentUser,
  ApiResponse,
} from '../models/dashboard.models';

// TODO: Replace with your Angular injection token for the base API URL.
// import { API_URL } from '../../../app.config';

/** Simulates network latency in development. Remove when real API is used. */
const MOCK_DELAY_MS = 400;

const mockDelay = <T>(value: T): Promise<T> =>
  new Promise(res => setTimeout(() => res(value), MOCK_DELAY_MS));

@Injectable({ providedIn: 'root' })
export class StaffDashboardService {

  // private readonly http = inject(HttpClient);
  // private readonly apiUrl = inject(API_URL);

  // ─────────────────────────────────────────────────────────
  // Public API — each method maps to one backend endpoint.
  // ─────────────────────────────────────────────────────────

  /**
   * Fetches the full staff dashboard snapshot.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/staff?branchId=<id>
   *   Returns: ApiResponse<StaffDashboardSnapshot>
   */
  async getSnapshot(branchId?: string): Promise<StaffDashboardSnapshot> {
    // TODO: return firstValueFrom(
    //   this.http.get<ApiResponse<StaffDashboardSnapshot>>(
    //     `${this.apiUrl}/dashboard/staff`, { params: { branchId: branchId ?? '' } }
    //   )
    // ).then(r => r.data);
    return mockDelay(this.buildMockSnapshot());
  }

  /**
   * Fetches KPI summary cards for the staff member.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/staff/kpi?branchId=<id>&staffId=<id>
   *   Returns: ApiResponse<StaffKpiCard[]>
   */
  async getKpiCards(branchId: string): Promise<StaffKpiCard[]> {
    // TODO: backend call
    return mockDelay(MOCK_STAFF_KPI);
  }

  /**
   * Fetches 7-day weekly sales bar chart data.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/staff/weekly-sales?branchId=<id>
   *   Returns: ApiResponse<WeeklyBarData[]>
   */
  async getWeeklySales(branchId: string): Promise<WeeklyBarData[]> {
    // TODO: backend call
    return mockDelay(MOCK_WEEKLY_DATA);
  }

  /**
   * Fetches items with low stock that need staff attention.
   *
   * TODO: Replace with:
   *   GET /api/v1/inventory/stock-alerts?branchId=<id>&staffView=true
   *   Returns: ApiResponse<StockAlert[]>
   */
  async getStockAlerts(branchId: string): Promise<StockAlert[]> {
    // TODO: backend call
    return mockDelay(MOCK_STOCK_ALERTS);
  }

  /**
   * Fetches most-searched medicines within the branch.
   *
   * TODO: Replace with:
   *   GET /api/v1/analytics/top-searched?branchId=<id>&limit=5
   *   Returns: ApiResponse<SearchedItem[]>
   */
  async getTopSearched(branchId: string): Promise<SearchedItem[]> {
    // TODO: backend call
    return mockDelay(MOCK_TOP_SEARCHED);
  }

  /**
   * Fetches inventory status breakdown for the donut chart.
   *
   * TODO: Replace with:
   *   GET /api/v1/inventory/status-summary?branchId=<id>
   *   Returns: ApiResponse<InventoryStatus>
   */
  async getInventoryStatus(branchId: string): Promise<InventoryStatus> {
    // TODO: backend call
    return mockDelay(MOCK_INVENTORY_STATUS);
  }

  /**
   * Triggers a restock request from a staff member.
   *
   * TODO: Replace with:
   *   POST /api/v1/inventory/restock-request
   *   Body: { medicineName: string; branchId: string; staffId: string }
   *   Returns: ApiResponse<{ requestId: string }>
   */
  async requestRestock(medicineName: string, branchId: string): Promise<void> {
    // TODO: backend call
    console.log(`[DEV] Staff restock request: ${medicineName} @ branch ${branchId}`);
    return mockDelay(undefined);
  }

  // ─────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────

  private buildMockSnapshot(): StaffDashboardSnapshot {
    return {
      user: MOCK_STAFF_USER,
      kpiCards: MOCK_STAFF_KPI,
      weeklyData: MOCK_WEEKLY_DATA,
      stockAlerts: MOCK_STOCK_ALERTS,
      topSearched: MOCK_TOP_SEARCHED,
      inventoryStatus: MOCK_INVENTORY_STATUS,
      branchAddress: 'Central Medical Plaza, 12 Health Ave, New York, NY',
    };
  }
}

// =============================================================
// MOCK DATA — Remove or tree-shake when backend is connected.
// =============================================================

const MOCK_STAFF_USER: CurrentUser = {
  id: 'usr-002',
  name: 'Sarah Johnson',
  email: 'sarah@pharmalogix.com',
  role: 'Staff Pharmacist',
  branchId: 'br-001',
};

const MOCK_STAFF_KPI: StaffKpiCard[] = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: '$24,563',
    trendLabel: '+12.5% this month',
    trend: 'positive',
    variant: 'revenue',
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions Today',
    value: '142',
    trendLabel: '+8.2% vs yesterday',
    trend: 'positive',
    variant: 'default',
  },
  {
    id: 'medicines-added',
    label: 'Medicines Added',
    value: '36',
    trendLabel: '+4 since last week',
    trend: 'positive',
    variant: 'default',
  },
  {
    id: 'low-stock',
    label: 'Low Stock Alerts',
    value: '7',
    trendLabel: '3 critical items',
    trend: 'negative',
    variant: 'alert',
  },
];

const MOCK_WEEKLY_DATA: WeeklyBarData[] = [
  { label: 'MON', value: 3200,  height: 80,  active: false },
  { label: 'TUE', value: 4100,  height: 100, active: false },
  { label: 'WED', value: 3800,  height: 95,  active: false },
  { label: 'THU', value: 5200,  height: 130, active: false },
  { label: 'FRI', value: 4800,  height: 120, active: true  },
  { label: 'SAT', value: 3600,  height: 90,  active: false },
  { label: 'SUN', value: 2900,  height: 72,  active: false },
];

const MOCK_STOCK_ALERTS: StockAlert[] = [
  { name: 'Amoxicillin 500mg', quantity: 12, status: 'HIGH DEMAND' },
  { name: 'Lisinopril 10mg',   quantity: 8,  status: 'STEADY'      },
  { name: 'Metformin 850mg',   quantity: 5,  status: 'HIGH DEMAND' },
];

const MOCK_TOP_SEARCHED: SearchedItem[] = [
  { name: 'Amoxicillin', count: 84 },
  { name: 'Paracetamol', count: 62 },
  { name: 'Ibuprofen',   count: 58 },
  { name: 'Omeprazole',  count: 41 },
];

const MOCK_INVENTORY_STATUS: InventoryStatus = {
  total: 248,
  inStockPct: 60,
  lowStockPct: 25,
  criticalPct: 15,
};
