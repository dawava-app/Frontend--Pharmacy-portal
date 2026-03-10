import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { SearchIcon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, HugeiconsIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('PharmacyPortal');
  SearchIcon = SearchIcon;
}
