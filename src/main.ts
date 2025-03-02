import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { BracketComponent } from './app/bracket/bracket.component';

const routes: Routes = [
  { path: '', redirectTo: '/bracket/east', pathMatch: 'full' }, // Redirect to default region
  { path: 'bracket/:region', component: BracketComponent }, // Allow dynamic region selection
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)], // Provide routing globally
}).catch(err => console.error(err));

