import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async signUp() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      await updateProfile(userCredential.user, { displayName: this.username });
      this.router.navigate(['/bracket/pick']); // Redirect to home after successful signup
    } catch (error: any) {
      this.errorMessage = error.message;
      console.error('Signup error:', error);
    }
  }
}
