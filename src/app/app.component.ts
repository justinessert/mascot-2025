import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterModule } from '@angular/router';
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
    RouterModule,
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
  bracketSubMenuOpen = false; // Closed by default
  isMobileView = window.innerWidth <= 768;
  isHomePage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/' || event.url === '/home';
        if (this.isHomePage) {
          this.menuOpen = false; // Ensure menu is closed on the home page
        }
      }
    });
  }

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
