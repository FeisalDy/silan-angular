import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // This is a placeholder. In a real app, you would get this
  // from localStorage, a cookie, or after a login process.
  private _token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkxZTNmMzItMDZhMC00YWM1LWE1ZmUtOGIyNGM1YzQwMmY2IiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImV4cCI6MTc2MjQ4NjkxNCwibmJmIjoxNzYyNDAwNTE0LCJpYXQiOjE3NjI0MDA1MTR9.CykiuYANE1VNfVklR-16ilUioFmNpSDvXqEVwGUtqeY';

  constructor() {}

  getToken(): string | null {
    return this._token;
  }
}
