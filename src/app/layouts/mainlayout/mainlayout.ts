import { Component } from '@angular/core';
import { Sidebar } from "./sidebar/sidebar";
import { Route } from '@hugeicons/core-free-icons';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.scss',
})
export class Mainlayout {

}
