// ============================================================
// Dashboard Container
// Path: src/app/features/dashboard/dashboard.ts
// Purpose: Role-aware entry point.  Reads the user's role
//          from AuthService and immediately redirects to
//          the appropriate role dashboard (/dashboard/manager,
//          /dashboard/staff, /dashboard/admin).
// ============================================================

import { Component, OnInit, inject }        from '@angular/core';
import { Router, RouterOutlet }              from '@angular/router';
import { AuthService }                       from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  // Minimal template – just a router-outlet for child routes.
  // The ngOnInit redirect happens before any content is painted.
  template: `<router-outlet />`,
})
export class Dashboard implements OnInit {

  private readonly router      = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.redirectByRole();
  }

  private redirectByRole(): void {
    // TODO: Replace with authService.getUserRole() once that method is added
    // to AuthService. Currently deriving from the stored permissions.
    const role = this.authService.getRole()?.toLowerCase() ?? '';
    this.navigateToRoleDashboard(role || 'staff');
  }

  private navigateToRoleDashboard(role: string): void {
    const routeMap: Record<string, string> = {
      admin:   'dashboard/admin',
      manager: 'dashboard/manager',
      staff:   'dashboard/staff',
    };

    const target = routeMap[role] ?? 'dashboard/staff';
    this.router.navigate([target], { replaceUrl: true });
  }
}
