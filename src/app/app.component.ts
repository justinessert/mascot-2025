import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NgFor, NgIf, CommonModule, TitleCasePipe } from '@angular/common';
import { Auth, getAuth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { ReplaceUnderscorePipe } from './replace-underscore.pipe';
import { bracketData, currentYear } from './constants';
import { BracketService } from './services/bracket.service';

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
    TitleCasePipe,
    ReplaceUnderscorePipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mascot Madness Bracket';
  regions = ['east', 'west', 'midwest', 'south', 'final_four'];
  menuOpen = false;
  bracketSubMenuOpen = false; // Closed by default
  yearSubMenuOpen = false; // Closed by default
  isMobileView = window.innerWidth <= 768;
  isHomePage = false;
  realCurrentYear: number = new Date().getFullYear();
  currentYear: number = currentYear;
  years: number[] = Object.keys(bracketData).map(key => Number(key));
  user: User | null = null;

  constructor(private router: Router, private bracketService: BracketService, private auth: Auth) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/' || event.url === '/home';
        if (this.isHomePage) {
          this.menuOpen = false; // Ensure menu is closed on the home page
        }
      }
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.user = user; // Track the signed-in user
      });

      // Listen for authentication state changes
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    });
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']); // Redirect to login after logout
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
    this.router.navigate(['/bracket/view', region]);
    this.menuOpen = false;
  }

  selectYear(year: number) {
    this.bracketService.setYear(year);
  }

  toggleYearSubMenu() {
    this.yearSubMenuOpen = !this.yearSubMenuOpen;
  }
}
