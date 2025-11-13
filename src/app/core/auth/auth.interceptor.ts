import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SnackbarHandlerService } from '@/app/shared/services/snackbar-handler.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorHandler = inject(SnackbarHandlerService);
  const token = authService.token();

  let authReq = req;

  // Add Authorization header if token exists and header is not already present
  if (!req.headers.has('Authorization') && token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Handle error through centralized error handler
      errorHandler.handle(error);

      // For 401 errors, don't rethrow to prevent duplicate error handling
      if (error.status === 401) {
        return EMPTY;
      }

      // Rethrow other errors so components can handle them if needed
      return throwError(() => error);
    })
  );
};
