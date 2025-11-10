import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Generates a user-friendly error message based on all built-in validator errors.
   * Returns the first applicable message in a sensible priority order.
   */
  getErrorMessage(
    control: AbstractControl | null,
    controlName: string
  ): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors as { [key: string]: any };
    const name = this.capitalize(controlName);

    // Priority order for common validators
    const priority = [
      'required',
      'requiredTrue',
      'email',
      'minlength',
      'maxlength',
      'min',
      'max',
      'pattern',
    ];

    for (const key of priority) {
      if (!errors.hasOwnProperty(key)) {
        continue;
      }
      const err = errors[key];

      switch (key) {
        case 'required':
          return `${name} is required.`;
        case 'requiredTrue':
          return `${name} must be accepted.`;
        case 'email':
          return 'Please enter a valid email address (e.g., example@domain.com).';
        case 'minlength': {
          const requiredLength = err?.requiredLength ?? err?.required ?? null;
          if (requiredLength != null) {
            return `${name} must be at least ${requiredLength} character${
              requiredLength === 1 ? '' : 's'
            } long.`;
          }
          return `${name} is too short.`;
        }
        case 'maxlength': {
          const requiredLength = err?.requiredLength ?? err?.required ?? null;
          if (requiredLength != null) {
            return `${name} cannot be more than ${requiredLength} character${
              requiredLength === 1 ? '' : 's'
            }.`;
          }
          return `${name} is too long.`;
        }
        case 'min': {
          const min = err?.min ?? err?.required ?? null;
          if (min != null) {
            return `${name} must be at least ${min}.`;
          }
          return `${name} is below the minimum allowed value.`;
        }
        case 'max': {
          const max = err?.max ?? err?.required ?? null;
          if (max != null) {
            return `${name} must be at most ${max}.`;
          }
          return `${name} exceeds the maximum allowed value.`;
        }
        case 'pattern': {
          const pattern = err?.requiredPattern;
          if (pattern) {
            return `${name} has an invalid format. Expected pattern: ${pattern}.`;
          }
          return `${name} has an invalid format.`;
        }
      }
    }

    // If none of the prioritized keys matched, try to return a meaningful message
    const firstKey = Object.keys(errors)[0];
    const firstError = errors[firstKey];

    // If the error value provides a message property, use it
    if (firstError && typeof firstError === 'object' && firstError.message) {
      return String(firstError.message);
    }

    // If the error itself is a string, return it
    if (typeof firstError === 'string') {
      return firstError;
    }

    // Generic fallback
    return 'Validation failed.';
  }
}
