import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, Router, NavigationEnd } from '@angular/router';
import { AppComponent } from './app/app.component';
import { BracketComponent } from './app/bracket/bracket.component';
import { HomeComponent } from './app/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // Home page route
  { path: 'bracket/:region', component: BracketComponent }, // Bracket with selected region
  { path: 'bracket', redirectTo: 'bracket/east' },  // Base bracket route
  { path: '**', redirectTo: '' } // Redirect any unknown route to home
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).then(app => {
  const router = app.injector.get(Router);
  
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      (window as any).gtag('config', 'G-JWWPRW6P12', { page_path: event.urlAfterRedirects });
    }
  });
}).catch(err => console.error(err));
