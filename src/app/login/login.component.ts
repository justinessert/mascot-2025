import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { getAuth, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BracketService } from '../services/bracket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  user: User | null = null;
  errorMessage: string = '';

  constructor(private router: Router, private bracketService: BracketService) {
    const auth = getAuth();
    auth.onAuthStateChanged(async user => {
      this.user = user;
      if (user) {
        console.log('User logged in:', user.uid);
        const bracketExists: boolean = await this.bracketService.loadBracket();
        
        // ✅ Redirect based on bracket existence
        if (bracketExists) {
          this.router.navigate(['/bracket/view/final_four']);
        } else {
          this.router.navigate(['/bracket/pick']);
        }
      }
    });
  }

  // Sign In with Email & Password
  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(result => {
        this.user = result.user;
        console.log("User signed in:", this.user);
      })
      .catch(error => {
        this.errorMessage = error.message;
        console.error("Login error:", error);
      });
  }

  // Sign Up (Register New User)
  signup() {
    this.router.navigate(['/signup']);
  }

  // Logout
  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.user = null;
      console.log("User signed out");
    });
  }
}
