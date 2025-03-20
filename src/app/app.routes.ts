import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { WinnerSelectionComponent } from './winner-selection/winner-selection.component';
import { BracketDisplayComponent } from './bracket-display/bracket-display.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BracketViewComponent } from './bracket-view/bracket-view.component';
import { FullBracketWrapperComponent } from './full-bracket-wrapper/full-bracket-wrapper.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Home page route
  { path: 'login', component: LoginComponent },  // Login page route
  { path: 'signup', component: SignupComponent },  // Signup page route
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'bracket', redirectTo: 'bracket/pick', pathMatch: 'full' },  // Base bracket route
  { path: 'bracket/pick', component: WinnerSelectionComponent },  // Base pick route
  { path: 'bracket/view/full', component: FullBracketWrapperComponent },  // Base display route
  { path: 'bracket/view/:region', component: BracketDisplayComponent },  // Base display route
  { path: 'bracket/:uuid', component: BracketViewComponent },
  { path: '**', redirectTo: 'login' } // Redirect any unknown route to home
];
