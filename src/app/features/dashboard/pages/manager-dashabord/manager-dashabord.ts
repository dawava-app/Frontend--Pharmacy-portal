import {
  Component,
  signal,
  computed,
  HostListener,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../../../core/services/auth.service';

interface Branch {
  id: number;
  name: string;
  location: string;
  address: string;
}

interface Medicine {
  name: string;
  type: string;
  sold: number;
}

interface StockItem {
  name: string;
  stock: number;
  threshold: number;
  status: string;
}

@Component({
  selector: 'app-manager-dashabord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashabord.html',
  styleUrl: './manager-dashabord.scss',
  animations: [
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px) scale(0.97)' }),
        animate('180ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('140ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(-6px) scale(0.97)' })),
      ]),
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('300ms 100ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ManagerDashabord {
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('branchDropdownRef') branchDropdownRef!: ElementRef;
  @ViewChild('userMenuRef') userMenuRef!: ElementRef;

  // Dropdown state
  branchDropdownOpen = signal(false);
  userMenuOpen = signal(false);
  mobileMenuOpen = signal(false);

  // Branch data
  branches = signal<Branch[]>([
    { id: 1, name: 'MAIN BRANCH', location: 'New York, NY', address: '742 Healthcare Blvd, Suite 100, Medical District, NY 10012' },
    { id: 2, name: 'DOWNTOWN BRANCH', location: 'Manhattan, NY', address: '55 Water St, Floor 3, Manhattan, NY 10041' },
    { id: 3, name: 'UPTOWN BRANCH', location: 'Bronx, NY', address: '1400 Pelham Pkwy, Bronx, NY 10461' },
  ]);

  currentBranch = signal<Branch>(this.branches()[0]);

  // Top medicines data
  topMedicines = signal<Medicine[]>([
    { name: 'Paracetamol 500mg', type: 'Pain Relief', sold: 1240 },
    { name: 'Amoxicillin 250mg', type: 'Antibiotic', sold: 856 },
    { name: 'Vitamin C 1000mg', type: 'Supplement', sold: 642 },
  ]);

  // Low stock items
  lowStockItems = signal<StockItem[]>([
    { name: 'Lisinopril 10mg', stock: 12, threshold: 50, status: 'Critical' },
    { name: 'Metformin 500mg', stock: 5, threshold: 40, status: 'Out of Stock Soon' },
    { name: 'Atorvastatin 20mg', stock: 18, threshold: 60, status: 'Critical' },
    { name: 'Omeprazole 20mg', stock: 22, threshold: 45, status: 'Out of Stock Soon' },
  ]);

  toggleBranchDropdown(): void {
    this.branchDropdownOpen.update(v => !v);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
    this.branchDropdownOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  selectBranch(branch: Branch): void {
    this.currentBranch.set(branch);
    this.branchDropdownOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (this.branchDropdownRef && !this.branchDropdownRef.nativeElement.contains(target)) {
      this.branchDropdownOpen.set(false);
    }
    if (this.userMenuRef && !this.userMenuRef.nativeElement.contains(target)) {
      this.userMenuOpen.set(false);
    }
  }
}
