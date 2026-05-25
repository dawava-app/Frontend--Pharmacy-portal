import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Hospital02Icon from '@hugeicons/core-free-icons/Hospital02Icon';
import DashboardSquare02Icon from '@hugeicons/core-free-icons/DashboardSquare02Icon';
import Store01Icon from '@hugeicons/core-free-icons/Store01Icon';
import LicenseDraftIcon from '@hugeicons/core-free-icons/LicenseDraftIcon';
import Message02Icon from '@hugeicons/core-free-icons/Message02Icon';
import Analytics03Icon from '@hugeicons/core-free-icons/Analytics03Icon';
import Setting07Icon from '@hugeicons/core-free-icons/Setting07Icon';
import UserIcon from '@hugeicons/core-free-icons/UserIcon';
import MentoringIcon from '@hugeicons/core-free-icons/MentoringIcon';
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
