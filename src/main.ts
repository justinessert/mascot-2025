import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AppComponent } from './app/app.component';
import { firebaseConfig } from './environments/firebase.config';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
}).then(app => {
  const router = app.injector.get(Router);
  
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      (window as any).gtag('config', 'G-JWWPRW6P12', { page_path: event.urlAfterRedirects });
    }
  });
}).catch(err => console.error(err));
