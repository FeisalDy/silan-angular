import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@/app/core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface NotificationConfig {
  duration?: number;
  action?: string;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarHandlerService {
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);

  private readonly defaultConfig: NotificationConfig = {
    duration: 5000,
    action: 'Close',
  };

  /**
   * Show a success message
   */
  success(message: string, config?: NotificationConfig): void {
    this.show(message, { ...this.defaultConfig, duration: 3000, ...config });
  }

  /**
   * Show an info message
   */
  info(message: string, config?: NotificationConfig): void {
    this.show(message, { ...this.defaultConfig, ...config });
  }

  /**
   * Show a warning message
   */
  warning(message: string, config?: NotificationConfig): void {
    this.show(message, { ...this.defaultConfig, ...config });
  }

  /**
   * Centralized error handler for HTTP and UI errors
   * @param error - Can be HttpErrorResponse or any JavaScript error
   * @param customMessage - Optional custom message to override default messages
   */
  error(error: any, customMessage?: string): void {
    let message = customMessage || this.getErrorMessage(error);

    // Show the error message
    this.show(message, this.defaultConfig);

    // Handle 401 Unauthorized - logout and redirect
    if (this.isHttpError(error) && error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Alias for error() to maintain backward compatibility
   */
  handle(error: any, customMessage?: string): void {
    this.error(error, customMessage);
  }

  /**
   * Private method to show snackbar
   */
  private show(message: string, config: NotificationConfig): void {
    this.snackBar.open(message, config.action, {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
    });
  }

  /**
   * Determines the appropriate error message based on the error type and status
   */
  private getErrorMessage(error: any): string {
    if (this.isHttpError(error)) {
      return this.getHttpErrorMessage(error);
    }

    // Handle non-HTTP errors (JS errors, etc.)
    if (error instanceof Error) {
      return error.message || 'An unexpected error occurred.';
    }

    // Fallback for unknown error types
    return typeof error === 'string' ? error : 'An unexpected error occurred.';
  }

  /**
   * Get error message for HTTP errors based on status code
   */
  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return 'The requested resource was not found.';
      case 400:
        // Try to get the error message from the response body
        return (
          this.extractErrorMessage(error) ||
          'Invalid request. Please check your input.'
        );
      case 422:
        return (
          this.extractErrorMessage(error) ||
          'Validation error. Please check your input.'
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return 'A server error occurred. Please try again later.';
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      default:
        if (error.status >= 500) {
          return 'A server error occurred. Please try again later.';
        }
        return (
          this.extractErrorMessage(error) || 'An unexpected error occurred.'
        );
    }
  }

  /**
   * Try to extract error message from the HTTP response body
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      // Check common error response formats
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.message) {
        return error.error.message;
      }
      if (error.error.error) {
        return typeof error.error.error === 'string'
          ? error.error.error
          : error.error.error.message;
      }
    }
    return null;
  }

  /**
   * Type guard to check if error is an HttpErrorResponse
   */
  private isHttpError(error: any): error is HttpErrorResponse {
    return error instanceof HttpErrorResponse;
  }

  /**
   * Check if an error should be handled globally
   * Returns true for errors that should be handled by the service (401, 403, 404, 500+)
   */
  shouldHandleGlobally(error: any): boolean {
    if (this.isHttpError(error)) {
      const status = error.status;
      return (
        status === 401 || status === 403 || status === 404 || status >= 500
      );
    }
    return false;
  }
}
