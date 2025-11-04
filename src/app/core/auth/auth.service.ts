import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // This is a placeholder. In a real app, you would get this
  // from localStorage, a cookie, or after a login process.
  private _token = 'my-super-secret-bearer-token';

  constructor() { }

  getToken(): string | null {
    return this._token;
  }
}
