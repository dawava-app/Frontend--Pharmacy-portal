// ============================================================
// Manager Dashboard Service
// Path: src/app/features/dashboard/services/manager-dashboard.service.ts
// Purpose: Provides all data for the Manager Dashboard.
//
//   ┌── MOCK MODE (current) ──────────────────────────────────┐
//   │  Returns static data via Promises with simulated delay. │
//   │  Swap each method for a real HttpClient call when the   │
//   │  backend is ready (see TODO comments per method).       │
//   └─────────────────────────────────────────────────────────┘
// ============================================================

import { Injectable, inject }               from '@angular/core';
import { HttpClient }                        from '@angular/common/http';
import { firstValueFrom }                    from 'rxjs';
import {
  ManagerDashboardSnapshot,
  Branch,
  ManagerKpiCard,
  RevenueDataPoint,
  TopMedicine,
  LowStockItem,
  StaffGroup,
  CurrentUser,
  ApiResponse,
  PaginatedResponse,
} from '../models/dashboard.models';

// TODO: Replace with your Angular injection token for the base API URL.
// import { API_URL } from '../../../app.config';

/** Simulates network latency in development. Remove when real API is used. */
const MOCK_DELAY_MS = 400;

const mockDelay = <T>(value: T): Promise<T> =>
  new Promise(res => setTimeout(() => res(value), MOCK_DELAY_MS));

@Injectable({ providedIn: 'root' })
export class ManagerDashboardService {

  // private readonly http = inject(HttpClient);
  // private readonly apiUrl = inject(API_URL);

  // ─────────────────────────────────────────────────────────
  // Public API — each method maps to one backend endpoint.
  // ─────────────────────────────────────────────────────────

  /**
   * Fetches the full manager dashboard snapshot.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager?branchId=<id>
   *   Returns: ApiResponse<ManagerDashboardSnapshot>
   */
  async getSnapshot(branchId?: string): Promise<ManagerDashboardSnapshot> {
    // TODO: return firstValueFrom(
    //   this.http.get<ApiResponse<ManagerDashboardSnapshot>>(
    //     `${this.apiUrl}/dashboard/manager`, { params: { branchId: branchId ?? '' } }
    //   )
    // ).then(r => r.data);
    return mockDelay(this.buildMockSnapshot());
  }

  /**
   * Fetches all branches visible to the current manager.
   *
   * TODO: Replace with:
   *   GET /api/v1/branches?role=manager
   *   Returns: ApiResponse<Branch[]>
   */
  async getBranches(): Promise<Branch[]> {
    // TODO: return firstValueFrom(
    //   this.http.get<ApiResponse<Branch[]>>(`${this.apiUrl}/branches`)
    // ).then(r => r.data);
    return mockDelay(MOCK_BRANCHES);
  }

  /**
   * Fetches KPI summary cards for a branch.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager/kpi?branchId=<id>&period=day
   *   Returns: ApiResponse<ManagerKpiCard[]>
   */
  async getKpiCards(branchId: string): Promise<ManagerKpiCard[]> {
    // TODO: backend call
    return mockDelay(MOCK_KPI_CARDS);
  }

  /**
   * Fetches 7-day stock trend data for the line chart.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager/stock-trend?branchId=<id>&days=7
   *   Returns: ApiResponse<RevenueDataPoint[]>
   */
  async getStockTrend(branchId: string): Promise<RevenueDataPoint[]> {
    // TODO: backend call
    return mockDelay(MOCK_STOCK_TREND);
  }

  /**
   * Fetches 7-day sales data for the bar chart.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager/sales?branchId=<id>&days=7
   *   Returns: ApiResponse<RevenueDataPoint[]>
   */
  async getSalesData(branchId: string): Promise<RevenueDataPoint[]> {
    // TODO: backend call
    return mockDelay(this.withHeights(MOCK_SALES_DATA));
  }

  /**
   * Fetches top-selling medicines for the branch.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager/top-medicines?branchId=<id>&limit=5
   *   Returns: ApiResponse<TopMedicine[]>
   */
  async getTopMedicines(branchId: string): Promise<TopMedicine[]> {
    // TODO: backend call
    return mockDelay(MOCK_TOP_MEDICINES);
  }

  /**
   * Fetches items below minimum stock threshold.
   *
   * TODO: Replace with:
   *   GET /api/v1/inventory/low-stock?branchId=<id>
   *   Returns: PaginatedResponse<LowStockItem>
   */
  async getLowStockItems(branchId: string): Promise<LowStockItem[]> {
    // TODO: backend call
    return mockDelay(MOCK_LOW_STOCK);
  }

  /**
   * Fetches staff group summary for the branch.
   *
   * TODO: Replace with:
   *   GET /api/v1/dashboard/manager/staff-summary?branchId=<id>
   *   Returns: ApiResponse<StaffGroup[]>
   */
  async getStaffGroups(branchId: string): Promise<StaffGroup[]> {
    // TODO: backend call
    return mockDelay(MOCK_STAFF_GROUPS);
  }

  /**
   * Triggers a restock request for a medicine item.
   *
   * TODO: Replace with:
   *   POST /api/v1/inventory/restock
   *   Body: { medicineName: string; branchId: string }
   *   Returns: ApiResponse<{ orderId: string }>
   */
  async requestRestock(medicineName: string, branchId: string): Promise<void> {
    // TODO: backend call
    console.log(`[DEV] Restock requested: ${medicineName} for branch ${branchId}`);
    return mockDelay(undefined);
  }

  // ─────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────

  private buildMockSnapshot(): ManagerDashboardSnapshot {
    return {
      user: MOCK_MANAGER_USER,
      branches: MOCK_BRANCHES,
      kpiCards: MOCK_KPI_CARDS,
      stockTrendData: MOCK_STOCK_TREND,
      salesData: this.withHeights(MOCK_SALES_DATA),
      topMedicines: MOCK_TOP_MEDICINES,
      lowStockItems: MOCK_LOW_STOCK,
      staffGroups: MOCK_STAFF_GROUPS,
    };
  }

  /** Normalises sales values to CSS height percentages (max = 100). */
  private withHeights(data: RevenueDataPoint[]): RevenueDataPoint[] {
    const max = Math.max(...data.map(d => d.value), 1);
    return data.map(d => ({ ...d, heightPct: Math.round((d.value / max) * 100) }));
  }
}

// =============================================================
// MOCK DATA — Remove or tree-shake when backend is connected.
// =============================================================

const MOCK_MANAGER_USER: CurrentUser = {
  id: 'usr-001',
  name: 'James Wilson',
  email: 'james.wilson@pharmalogix.com',
  role: 'Senior Manager',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop',
  branchId: 'br-001',
};

const MOCK_BRANCHES: Branch[] = [
  { id: 'br-001', name: 'Downtown Branch', location: 'New York, NY', address: '123 Medical Ave, New York, NY 10001', isMain: true },
  { id: 'br-002', name: 'Midtown Branch',  location: 'New York, NY', address: '456 Health Blvd, New York, NY 10036' },
  { id: 'br-003', name: 'Uptown Branch',   location: 'New York, NY', address: '789 Pharma St, New York, NY 10031' },
];

const MOCK_KPI_CARDS: ManagerKpiCard[] = [
  {
    id: 'total-medicines',
    label: 'Total Medicines',
    value: '5,420',
    change: '+2.5%',
    changeLabel: '+2.5% this month',
    trend: 'up',
    variant: 'default',
    iconColor: 'teal',
  },
  {
    id: 'out-of-stock',
    label: 'Out-of-Stock',
    value: '8',
    variant: 'alert',
    iconColor: 'red',
    badge: 'Requires Attention',
  },
  {
    id: 'daily-revenue',
    label: 'Daily Revenue',
    value: '$12,840',
    change: '+15%',
    changeLabel: '+15% from yesterday',
    trend: 'up',
    variant: 'default',
    iconColor: 'teal',
  },
];

const MOCK_STOCK_TREND: RevenueDataPoint[] = [
  { label: 'MON', value: 320 },
  { label: 'TUE', value: 410 },
  { label: 'WED', value: 380 },
  { label: 'THU', value: 520 },
  { label: 'FRI', value: 480 },
  { label: 'SAT', value: 360 },
  { label: 'SUN', value: 290 },
];

const MOCK_SALES_DATA: RevenueDataPoint[] = [
  { label: 'MON', value: 4500 },
  { label: 'TUE', value: 4000 },
  { label: 'WED', value: 5500 },
  { label: 'THU', value: 6000 },
  { label: 'FRI', value: 5000 },
  { label: 'SAT', value: 6800 },
  { label: 'SUN', value: 7500 },
];

const MOCK_TOP_MEDICINES: TopMedicine[] = [
  { name: 'Amoxicillin',         type: 'Antibiotic',     sold: 1240 },
  { name: 'Paracetamol 500mg',   type: 'Analgesic',      sold: 980  },
  { name: 'Metformin 850mg',     type: 'Antidiabetic',   sold: 870  },
  { name: 'Lisinopril 10mg',     type: 'Antihypertens.', sold: 756  },
  { name: 'Omeprazole 20mg',     type: 'PPI',            sold: 642  },
];

const MOCK_LOW_STOCK: LowStockItem[] = [
  { name: 'Amoxicillin 500mg',   stock: 12,  threshold: 50,  status: 'Critical'    },
  { name: 'Insulin Glargine',    stock: 8,   threshold: 30,  status: 'Critical'    },
  { name: 'Atorvastatin 40mg',   stock: 22,  threshold: 50,  status: 'Low'         },
  { name: 'Metformin 1000mg',    stock: 0,   threshold: 40,  status: 'Out of Stock'},
  { name: 'Lisinopril 5mg',      stock: 18,  threshold: 40,  status: 'Low'         },
  { name: 'Omeprazole 40mg',     stock: 5,   threshold: 30,  status: 'Critical'    },
  { name: 'Losartan 50mg',       stock: 15,  threshold: 40,  status: 'Low'         },
  { name: 'Amlodipine 5mg',      stock: 0,   threshold: 35,  status: 'Out of Stock'},
];

const MOCK_STAFF_GROUPS: StaffGroup[] = [
  {
    type: 'Pharmacists',
    total: 28,
    onDuty: 28,
    onLeave: 0,
    iconColor: 'teal',
    statusLabel: 'All On Duty',
    statusClass: 'on-duty',
  },
  {
    type: 'Technicians',
    total: 15,
    onDuty: 14,
    onLeave: 1,
    iconColor: 'orange',
    statusLabel: '1 On Leave',
    statusClass: 'on-leave',
  },
];
