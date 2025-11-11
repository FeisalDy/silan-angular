import { ApiService } from '@/app/core/api/api.service';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  Permissions,
} from './auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly BASE_PATH = '/auth';
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  private _tokenSignal = signal<string | null>(null);
  private _userSignal = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this._tokenSignal.set(localStorage.getItem('access_token'));
      this._userSignal.set(this.loadUserFromStorage());
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
    this._tokenSignal.set(token);
    this._userSignal.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearSession(): void {
    this._tokenSignal.set(null);
    this._userSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  readonly token = this._tokenSignal.asReadonly();
  readonly user = this._userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.token());
  readonly permission = computed(
    () => this.user()?.permissions as Permissions | null | undefined
  );

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

  hasPermission(
    resource: keyof Permissions,
    action: Permissions[keyof Permissions] extends
      | (infer ActionType)[]
      | undefined
      ? ActionType
      : never
  ): boolean {
    const permissions = this.permission();
    if (!permissions) {
      return false;
    }

    const grantedActions = permissions[resource] as string[] | undefined;

    return grantedActions ? grantedActions.includes(action) : false;
  }

  logout(): void {
    this.clearSession();
  }
}
