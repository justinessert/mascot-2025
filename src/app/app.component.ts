import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { NgFor, CommonModule, TitleCasePipe } from '@angular/common';

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
    TitleCasePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mascot Madness Bracket';
  regions = ['east', 'west', 'midwest', 'south'];
  menuOpen = false; // Use menuOpen consistently

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Toggle menu visibility
  }

  selectRegion(region: string) {
    this.router.navigate(['/bracket', region]);
    this.menuOpen = false; // Close menu after selection
  }
}
