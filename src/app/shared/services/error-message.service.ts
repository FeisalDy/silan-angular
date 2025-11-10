import { Injectable } from '@angular/core';
import { ApiResponse } from '@/app/core/api/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorMapping {
  pattern: RegExp;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private mappings: ErrorMapping[] = [
    {
      pattern: /invalid email|invalid password|invalid credentials/i,
      message: 'Invalid email or password.',
    },
    { pattern: /user not found|no user/i, message: 'Account not found.' },
    {
      pattern: /already exists|taken|duplicate/i,
      message: 'The provided value is already in use.',
    },
    {
      pattern: /unauthorized|unauthenticated|not authorized/i,
      message: 'You are not authorized. Please sign in.',
    },
    {
      pattern: /forbidden/i,
      message: "You don't have permission to perform this action.",
    },
    {
      pattern: /timeout|timed out/i,
      message: 'The request timed out. Please try again.',
    },
    {
      pattern: /network error|failed to fetch/i,
      message: 'Network error. Check your connection.',
    },
  ];

  /**
   * Register a custom mapping. Useful for feature-specific errors.
   */
  register(pattern: RegExp | string, message: string) {
    const re = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
    this.mappings.unshift({ pattern: re, message });
  }

  /**
   * Map raw error input to a friendly message.
   * Accepts strings, Error objects, or ApiResponse-like objects.
   */
  getMessage(raw: unknown, fallback = 'An unexpected error occurred.'): string {
    if (raw == null) return fallback;

    // 🟢 1. Handle Angular HttpErrorResponse
    if (raw instanceof HttpErrorResponse) {
      const err = raw as HttpErrorResponse;

      // Prefer backend's ApiResponse message
      const api = err.error as ApiResponse<unknown> | any;
      if (
        api?.message &&
        typeof api.message === 'string' &&
        api.message.trim()
      ) {
        return this.mapString(api.message) ?? api.message;
      }

      // Handle cases where backend returns `error` or `errors`
      if (api?.error && typeof api.error === 'string')
        return this.mapString(api.error) ?? api.error;
      if (api?.errors) {
        const first = Array.isArray(api.errors) ? api.errors[0] : api.errors;
        if (typeof first === 'string') return this.mapString(first) ?? first;
      }

      // Fallback to status text or HTTP code
      if (err.status === 0)
        return 'Cannot reach the server. Please check your connection.';
      if (err.status >= 500)
        return 'A server error occurred. Please try again later.';
      return err.statusText || fallback;
    }

    // 🟢 2. Handle plain ApiResponse-like object (non-HttpErrorResponse)
    try {
      const obj = raw as ApiResponse<unknown> | any;
      if (obj && typeof obj === 'object') {
        if (typeof obj.message === 'string' && obj.message.trim()) {
          return this.mapString(obj.message) ?? obj.message;
        }
        if (typeof obj.error === 'string' && obj.error.trim()) {
          return this.mapString(obj.error) ?? obj.error;
        }
        if (obj.errors) {
          const first = Array.isArray(obj.errors) ? obj.errors[0] : obj.errors;
          if (typeof first === 'string') return this.mapString(first) ?? first;
        }
      }
    } catch {
      // ignore and continue
    }

    // 🟢 3. Handle standard JS Error
    if (raw instanceof Error) {
      return this.mapString(raw.message) ?? raw.message ?? fallback;
    }

    // 🟢 4. Handle plain string
    if (typeof raw === 'string') {
      return this.mapString(raw) ?? raw;
    }

    // 🟢 5. Handle unknown objects (try to stringify)
    try {
      const serialized = JSON.stringify(raw);
      return this.mapString(serialized) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private mapString(text: string | undefined | null): string | null {
    if (!text) return null;
    const trimmed = text.trim();
    for (const m of this.mappings) {
      if (m.pattern.test(trimmed)) {
        return m.message;
      }
    }
    return null;
  }
}
