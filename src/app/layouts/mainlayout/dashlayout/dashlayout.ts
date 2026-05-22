// ============================================================
// Dash Layout — NEW FILE
// Path: src/app/layouts/mainlayout/dashlayout/dashlayout.ts
//
// Purpose: Auth-protected shell for dashboard routes.
//          Dashboard components are self-contained (they include
//          their own sidebar), so this layout is intentionally
//          just a full-height router-outlet with no sidebar.
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="height:100vh; overflow:hidden; display:flex;">
      <router-outlet />
    </div>
  `,
})
export class DashLayout {}
