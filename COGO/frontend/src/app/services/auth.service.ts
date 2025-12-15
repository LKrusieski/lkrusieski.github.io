import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      username, password
    });
  }

  storeToken(token: string) {
    sessionStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    sessionStorage.setItem('role',payload.role);
    sessionStorage.setItem('userId', payload.userId);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getRole(): string {
    const role = sessionStorage.getItem('role');
    if (role) return role;

    const token = sessionStorage.getItem('token');
    if (!token) return '';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || '';
    } catch {
      return '';
    }
  }

  getUsername(): string {
    const token = sessionStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || '';
    } catch (e) {
      return '';
    }
  }


}
