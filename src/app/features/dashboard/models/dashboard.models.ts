// ============================================================
// Dashboard Models
// Path: src/app/features/dashboard/models/dashboard.models.ts
// Purpose: All shared TypeScript interfaces and types for
//          Manager and Staff dashboard features.
// ============================================================

// ─── Shared / Common ─────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  isMain?: boolean;
  lat?: number;
  lng?: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  branchId?: string;
}

/** Generic loading state for async operations */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ─── Manager Dashboard ───────────────────────────────────────

export interface ManagerKpiCard {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  /** Determines the icon color class: 'teal' | 'red' | 'orange' */
  variant: 'default' | 'alert';
  iconColor: 'teal' | 'red' | 'orange';
  badge?: string; // e.g. "Requires Attention"
}

export interface RevenueDataPoint {
  label: string;   // "MON", "TUE", ...
  value: number;
  /** Computed height percentage for bar charts (0-100) */
  heightPct?: number;
}

export interface TopMedicine {
  name: string;
  type: string;
  sold: number;
  revenue?: number;
}

export interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
  status: 'Critical' | 'Out of Stock' | 'Low';
}

export interface StaffGroup {
  type: string;
  total: number;
  onDuty: number;
  onLeave: number;
  /** Used to set icon/badge color class */
  iconColor: 'teal' | 'orange' | 'blue' | 'purple';
  statusLabel: string; // e.g. "All On Duty" | "1 On Leave"
  statusClass: 'on-duty' | 'on-leave' | 'warning';
}

export interface ManagerDashboardSnapshot {
  user: CurrentUser;
  branches: Branch[];
  kpiCards: ManagerKpiCard[];
  /** 7 data points for bar/line charts */
  stockTrendData: RevenueDataPoint[];
  salesData: RevenueDataPoint[];
  topMedicines: TopMedicine[];
  lowStockItems: LowStockItem[];
  staffGroups: StaffGroup[];
}

// ─── Staff Dashboard ─────────────────────────────────────────

export interface StaffKpiCard {
  id: string;
  label: string;
  value: string;
  trendLabel: string;
  trend: 'positive' | 'negative' | 'neutral';
  /** Style variant for the card */
  variant: 'revenue' | 'default' | 'alert';
}

export interface WeeklyBarData {
  label: string;
  value: number;
  /** Height in px for display */
  height: number;
  active: boolean;
}

export interface StockAlert {
  name: string;
  quantity: number;
  status: 'HIGH DEMAND' | 'STEADY' | 'LOW';
}

export interface SearchedItem {
  name: string;
  count: number;
}

export interface InventoryStatus {
  total: number;
  inStockPct: number;
  lowStockPct: number;
  criticalPct: number;
}

export interface StaffDashboardSnapshot {
  user: CurrentUser;
  kpiCards: StaffKpiCard[];
  weeklyData: WeeklyBarData[];
  stockAlerts: StockAlert[];
  topSearched: SearchedItem[];
  inventoryStatus: InventoryStatus;
  branchAddress: string;
}

// ─── API Response Wrappers ───────────────────────────────────
// TODO: Adjust to match actual backend response envelope.

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  status: 'ok' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
