// ============================================================
// Staff Dashboard Component
// Path: src/app/features/dashboard/staff/staff-dashboard/
// Files: staff-dashboard.ts | staff-dashboard.html | staff-dashboard.scss
// ============================================================

import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService }       from '../../../../core/services/auth.service';

// ─── Interfaces ───────────────────────────────────────────────

interface CurrentUser {
  name:  string;
  email: string;
  role:  string;
}

interface BarData {
  label:  string;
  value:  number;
  height: number;
  active: boolean;
}

interface StockAlert {
  name:     string;
  quantity: number;
  status:   'HIGH DEMAND' | 'STEADY';
}

interface SearchedItem {
  name:  string;
  count: number;
}

// ─── Component ────────────────────────────────────────────────

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './staff-dashboard.html',
  styleUrls: ['./staff-dashboard.scss'],
})
export class StaffDashboard implements OnInit, OnDestroy {

  // ── DI ──────────────────────────────────────────────────────
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  // ── State ───────────────────────────────────────────────────
  isProfileDropdownOpen = false;

  currentUser: CurrentUser = {
    name:  'Sarah Johnson',
    email: 'sarah@pharmalogix.com',
    role:  'Staff Pharmacist',
  };

  // ── Weekly Bar Chart Data ────────────────────────────────────
  readonly weeklyData: BarData[] = [
    { label: 'MON', value: 3200,  height: 80,  active: false },
    { label: 'TUE', value: 4100,  height: 100, active: false },
    { label: 'WED', value: 3800,  height: 95,  active: false },
    { label: 'THU', value: 5200,  height: 130, active: false },
    { label: 'FRI', value: 4800,  height: 120, active: true  },
    { label: 'SAT', value: 3600,  height: 90,  active: false },
    { label: 'SUN', value: 2900,  height: 72,  active: false },
  ];

  // ── Stock Alerts ─────────────────────────────────────────────
  readonly stockAlerts: StockAlert[] = [
    { name: 'Amoxicillin 500mg', quantity: 12, status: 'HIGH DEMAND' },
    { name: 'Lisinopril 10mg',   quantity: 8,  status: 'STEADY'      },
    { name: 'Metformin 850mg',   quantity: 5,  status: 'HIGH DEMAND' },
  ];

  // ── Top Searched ─────────────────────────────────────────────
  readonly topSearched: SearchedItem[] = [
    { name: 'Amoxicillin', count: 84 },
    { name: 'Paracetamol', count: 62 },
    { name: 'Ibuprofen',   count: 58 },
    { name: 'Omeprazole',  count: 41 },
  ];

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    // Optionally load current user from AuthService
    // const userData = this.authService.getCurrentUser();
    // if (userData) this.currentUser = userData;
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  // ── Dropdown ─────────────────────────────────────────────────

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  /**
   * Close dropdown when clicking outside the profile area.
   * The template uses (click)="$event.stopPropagation()" on the
   * dropdown itself so only outside clicks reach this listener.
   */
  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isProfileDropdownOpen) {
      this.closeProfileDropdown();
    }
  }

  // ── Auth ─────────────────────────────────────────────────────

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
