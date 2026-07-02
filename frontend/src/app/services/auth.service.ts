import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  ApiResponse,
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserDto,
} from '../models/models';
import { environment } from '../../environments/environment';

const API_BASE = environment.apiUrl;
const ACCESS_TOKEN_KEY = 'yq_access_token';
const REFRESH_TOKEN_KEY = 'yq_refresh_token';
const USER_KEY = 'yq_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<UserDto | null>(this.loadUser());
  isLoggedIn = signal<boolean>(!!this.getAccessToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginRequestDto): Observable<ApiResponse<AuthResponseDto>> {
    return this.http
      .post<ApiResponse<AuthResponseDto>>(`${API_BASE}/auth/login`, dto)
      .pipe(tap((res) => this.saveSession(res.data)));
  }

  register(dto: RegisterRequestDto): Observable<ApiResponse<AuthResponseDto>> {
    return this.http
      .post<ApiResponse<AuthResponseDto>>(`${API_BASE}/auth/register`, dto)
      .pipe(tap((res) => this.saveSession(res.data)));
  }

  logout(): void {
    const user = this.currentUser();
    if (user) {
      this.http
        .post(`${API_BASE}/auth/logout`, { userId: user.id })
        .subscribe({ error: () => {} });
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private saveSession(data: AuthResponseDto): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
    this.isLoggedIn.set(true);
  }

  updateStoredUser(user: UserDto): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  private loadUser(): UserDto | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
