import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { BracketComponent } from './app/bracket/bracket.component';

const routes: Routes = [
  { path: '', component: BracketComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
})
  .catch(err => console.error(err));

