import { Routes } from '@angular/router';
import { BracketComponent } from './bracket/bracket.component';

export const routes: Routes = [
  { path: '', redirectTo: '/bracket/east', pathMatch: 'full' }, // Default to East
  { path: 'bracket/:region', component: BracketComponent }, // Dynamic Route for Region Selection
];
