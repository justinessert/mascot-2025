import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NgFor, NgIf, CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    CommonModule,
    NgFor,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mascot Madness Bracket';
  regions = ['east', 'west', 'midwest', 'south'];
  menuOpen = false;
  bracketSubMenuOpen = true;
  isMobileView = window.innerWidth <= 768;

  constructor(private router: Router) {}

  @HostListener('window:resize', [])
  onResize() {
    this.isMobileView = window.innerWidth <= 768;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      this.bracketSubMenuOpen = false; // Close sub-menu when main menu closes
    }
  }

  toggleBracketSubMenu() {
    this.bracketSubMenuOpen = !this.bracketSubMenuOpen;
  }

  selectRegion(region: string) {
    this.router.navigate(['/bracket', region]);
    this.menuOpen = false;
  }
}
