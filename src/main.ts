import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, Router, NavigationEnd } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AppComponent } from './app/app.component';
import { BracketComponent } from './app/bracket/bracket.component';
import { HomeComponent } from './app/home/home.component';
import { WinnerSelectionComponent } from './app/winner-selection/winner-selection.component';
import { BracketDisplayComponent } from './app/bracket-display/bracket-display.component';
import { LoginComponent } from './app/login/login.component';
import { firebaseConfig } from './environments/firebase.config';
import { SignupComponent } from './app/signup/signup.component';


const routes: Routes = [
  { path: '', component: HomeComponent },  // Home page route
  { path: 'login', component: LoginComponent },  // Login page route
  { path: 'signup', component: SignupComponent },  // Signup page route
  { path: 'bracket', redirectTo: 'bracket/pick' },  // Base bracket route
  { path: 'bracket', component: BracketComponent, children: [
      { path: 'pick', component: WinnerSelectionComponent },
      { path: 'view/:region', component: BracketDisplayComponent },
  ]},
  { path: '**', redirectTo: '' } // Redirect any unknown route to home
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
}).then(app => {
  const router = app.injector.get(Router);
  
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      (window as any).gtag('config', 'G-JWWPRW6P12', { page_path: event.urlAfterRedirects });
    }
  });
}).catch(err => console.error(err));
