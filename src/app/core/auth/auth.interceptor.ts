import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // If the request already has an Authorization header, do nothing.
  // This allows services to override the token on a per-call basis.
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  // If we have a token, add it to the request
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  // If no token, proceed with the original request
  return next(req);
};
