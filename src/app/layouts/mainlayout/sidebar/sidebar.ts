import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hospital02Icon,
   DashboardSquare02Icon,
    Store01Icon,
    LicenseDraftIcon,
    Message02Icon,
    Analytics03Icon,
    Setting07Icon,
    UserIcon,
    MentoringIcon
    } from '@hugeicons/core-free-icons';
import { HugeiconsIconComponent } from '@hugeicons/angular';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, HugeiconsIconComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
//icons
PharmacyLogo = Hospital02Icon;
DashboardIcon = DashboardSquare02Icon;
Store01Icon = Store01Icon;
LicenseDraftIcon = LicenseDraftIcon;
Message02Icon = Message02Icon;
Analytics03Icon = Analytics03Icon;
Setting07Icon = Setting07Icon;
UserIcon = UserIcon;
MentoringIcon=MentoringIcon;
}
