import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(public auth: AuthService, private router: Router) { }

  onLogin() {
    this.auth.login(this.username, this.password)
      .subscribe({
        next: (res) => {
          //console.log('login response token:', res.token);
          this.auth.storeToken(res.token);
          //console.log('stored token:', localStorage.getItem('token'));
          this.router.navigate(['/items']);
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        }

      });
  }
}

