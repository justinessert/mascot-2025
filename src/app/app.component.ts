import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { NgFor, NgIf, CommonModule, TitleCasePipe } from '@angular/common';
import { Auth, getAuth, signOut, user, User } from '@angular/fire/auth';
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
  regionsMenu = ['east', 'west', 'midwest', 'south', 'final_four', 'full'];
  menuOpen = false;
  bracketSubMenuOpen = false; // Closed by default
  yearSubMenuOpen = false; // Closed by default
  isMobileView = window.innerWidth <= 768;
  isHomePage = false;
  realCurrentYear: number = new Date().getFullYear();
  currentYear: number = currentYear;
  selectedYear: number = currentYear;
  showBanner: boolean = this.selectedYear != this.realCurrentYear;
  years: number[] = Object.keys(bracketData).map(key => Number(key));
  user: User | null = null;

  constructor(private router: Router, public bracketService: BracketService, private auth: Auth, private titleService: Title, private metaService: Meta) {
    this.setSEO();
    this.bracketService.initialize(this.selectedYear); // Initialize bracket data
    user(auth).subscribe(async (authUser) => {
      this.user = authUser; // Track the signed-in user
      if (this.user) {
        await this.bracketService.loadBracket(); // Load bracket after authentication
      }
    });

    // ✅ Handle Navigation Events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/' || event.url === '/home';
        if (this.isHomePage) {
          this.menuOpen = false; // Ensure menu is closed on the home page
        }
      }
    });
  }



  setSEO() {
    this.titleService.setTitle("Mascot Madness - Create Your Mascot March Madness Bracket"); // Page title

    this.metaService.addTags([
      { name: 'description', content: 'Create and share your March Madness bracket based on team mascots!' },
      { name: 'keywords', content: 'March Madness, Bracket, Basketball, NCAA, Mascots, Mascot, Team' },
      { property: 'og:title', content: 'Mascot Madness Bracket Challenge' },
      { property: 'og:description', content: 'Pick your favorite team mascots and win!' },
      { property: 'og:image', content: 'https://mascot-madness.com/assets/banner.jpg' },
      { property: 'og:url', content: 'https://mascot-madness.com/' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]);
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']); // Redirect to login after logout
    });
    window.location.reload();
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
    this.selectedYear = year;
    this.bracketService.initialize(year);
  }

  toggleYearSubMenu() {
    this.yearSubMenuOpen = !this.yearSubMenuOpen;
  }

  closeBanner() {
    this.showBanner = false;
  }
}
