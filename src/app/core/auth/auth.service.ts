import { ApiService } from '@/app/core/api/api.service';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from './auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly BASE_PATH = '/auth';
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  private _token: string | null = null;
  private _user: User | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._token = localStorage.getItem('access_token');
      this._user = this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? (JSON.parse(userStr) as User) : null;
    } catch {
      return null;
    }
  }

  private saveSession(token: string, user: User): void {
    this._token = token;
    this._user = user;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearSession(): void {
    this._token = null;
    this._user = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  get token(): string | null {
    return this._token;
  }

  get user(): User | null {
    return this._user;
  }

  get isLoggedIn(): boolean {
    return !!this._token;
  }

  login(body: LoginRequest) {
    return this.api.post<LoginResponse>(`${this.BASE_PATH}/login`, body).pipe(
      tap((res) => {
        if (res.data?.token && res.data?.user) {
          this.saveSession(res.data.token, res.data.user);
        }
      })
    );
  }

  register(body: RegisterRequest) {
    return this.api
      .post<RegisterResponse>(`${this.BASE_PATH}/register`, body)
      .pipe(
        tap((res) => {
          if (res.data?.token && res.data?.user) {
            this.saveSession(res.data.token, res.data.user);
          }
        })
      );
  }

  getProfile() {
    return this.api.get<User>(`${this.BASE_PATH}/profile`);
  }

  logout(): void {
    this.clearSession();
  }
}
