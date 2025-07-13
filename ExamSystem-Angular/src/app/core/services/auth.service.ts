import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../env/env';

const API_URL = `${environment.baseUrl}Auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${API_URL}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role']; // Ensure your token uses "role"
  } catch (e) {
    return null;
  }
}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
