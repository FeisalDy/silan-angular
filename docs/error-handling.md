# Centralized Notification & Error Handling

This document describes the centralized notification and error handling system implemented in the application.

## Overview

The application uses a unified `SnackbarHandlerService` to handle all notifications (success, error, warning, info) consistently across the entire application. This ensures a uniform user experience, reduces code duplication, and eliminates the need to inject `MatSnackBar` in every component.

## Architecture

### SnackbarHandlerService

Located at: `src/app/core/services/error-handler.service.ts`

The service provides:
- **Unified notification system** for success, error, warning, and info messages
- **Automatic error handling** for HTTP and JavaScript errors
- **Automatic logout and redirect** on 401 Unauthorized errors
- **Consistent error messages** based on HTTP status codes
- **MatSnackBar integration** with customizable configuration
- **No need to inject MatSnackBar** in components

### Available Methods

#### 1. Success Messages
```typescript
notification.success('Operation completed successfully!');
notification.success('Saved!', { duration: 2000 });
```

#### 2. Error Messages
```typescript
// Automatic error handling with smart message detection
notification.error(httpError);

// Custom error message
notification.error(httpError, 'Failed to save. Please try again.');
```

#### 3. Warning Messages
```typescript
notification.warning('This action cannot be undone.');
```

#### 4. Info Messages
```typescript
notification.info('Processing your request...');
```

The service automatically handles common HTTP status codes:

- **401 Unauthorized**: Shows "Session expired" message, logs out user, and redirects to `/login`
- **403 Forbidden**: Shows "You don't have permission" message
- **404 Not Found**: Shows "Resource was not found" message
- **400 Bad Request**: Shows validation error message
- **422 Unprocessable Entity**: Shows validation error message
- **500+ Server Errors**: Shows "Server error occurred" message
- **0 Network Error**: Shows "Unable to connect to the server" message

### Key Features

#### 1. HTTP Error Handling

The service intelligently extracts error messages from various response formats:
```typescript
// Supports multiple error formats
error.error.message
error.error.error
error.error.error.message
```

#### 2. Error Message Extraction

The service provides a `shouldHandleGlobally(error)` method to determine if an error should be handled by the centralized service or locally by the component:

**Handled Globally:**
- 401, 403, 404, 500+ errors

**Handled Locally:**
- 400, 422 (validation errors)
- Business logic errors
- Success messages

## Usage

### In HTTP Interceptor

The `authInterceptor` automatically integrates with the `SnackbarHandlerService`:

```typescript
import { SnackbarHandlerService } from '@/app/core/services/error-handler.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(SnackbarHandlerService);
  
  return next(authReq).pipe(
    catchError((error) => {
      // Handle error through centralized error handler
      errorHandler.handle(error);

      // For 401 errors, don't rethrow
      if (error.status === 401) {
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};
```

### In Components

**❌ OLD WAY (Don't do this):**
```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyComponent {
  snackBar = inject(MatSnackBar);
  
  onSuccess() {
    this.snackBar.open('Success!', 'Close', { duration: 3000 });
  }
  
  onError(error: any) {
    if (error.status === 401) {
      this.snackBar.open('Session expired', 'Close');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.snackBar.open('Something went wrong', 'Close');
    }
  }
}
```

**✅ NEW WAY (Do this):**
```typescript
import { SnackbarHandlerService } from '@/app/core/services/error-handler.service';

export class MyComponent {
  notification = inject(SnackbarHandlerService);
  
  onSuccess() {
    this.notification.success('Success!');
  }
  
  onError(error: any) {
    // Automatically handles 401, 403, 404, 500+
    this.notification.error(error);
  }
}
```

For simple operations where you only need to handle success:

```typescript
this.service.someOperation().subscribe({
  next: (result) => {
    this.notification.success('Operation successful!');
  }
  // No error handler needed - interceptor handles it automatically
});
```

#### Pattern 2: Mixed Global and Local Error Handling

For operations that need custom error messages for certain errors:

```typescript
import { SnackbarHandlerService } from '@/app/core/services/error-handler.service';

export class MyComponent {
  notification = inject(SnackbarHandlerService);

  uploadFile(file: File) {
    this.service.upload(file).subscribe({
      next: () => {
        this.notification.success('Upload successful!');
      },
      error: (err) => {
        // Let global handler handle 401, 403, 404, 500+ errors
        if (this.notification.shouldHandleGlobally(err)) {
          return;
        }

        // Handle local/business logic errors (400, 422, etc.)
        this.notification.error(err, 'Upload failed. Please check your file.');
      }
    });
  }
}
```

#### Pattern 3: Using Different Notification Types

```typescript
// Success message (3 second duration by default)
this.notification.success('File uploaded successfully!');

// Warning message
this.notification.warning('File size is larger than recommended.');

// Info message
this.notification.info('Processing your request...');

// Error with custom message
this.notification.error(error, 'Failed to process file.');
```

## Benefits

1. **Consistency**: All notifications displayed uniformly across the application
2. **DRY Principle**: No need to inject `MatSnackBar` or repeat notification logic
3. **Centralized Control**: Easy to modify messages or behavior in one place
4. **Automatic Authentication**: 401 errors automatically log out users and redirect
5. **Better UX**: Clear, consistent messages for users
6. **Easier Testing**: Notification logic is isolated and testable
7. **Type Safety**: Strongly typed methods and configurations
8. **Flexible**: Supports custom messages and configurations

## Migration Guide

### Before (Old Pattern)

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyComponent {
  snackBar = inject(MatSnackBar);
  
  saveData() {
    this.service.save(data).subscribe({
      next: () => {
        this.snackBar.open('Saved successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBar.open('Session expired', 'Close');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('No permission', 'Close');
        } else if (err.status === 500) {
          this.snackBar.open('Server error', 'Close');
        } else {
          this.snackBar.open('Something went wrong', 'Close');
        }
      }
    });
  }
  
  deleteItem() {
    this.snackBar.open('File exceeds limit', 'Close', { duration: 3000 });
  }
}
```

### After (New Pattern)

```typescript
import { SnackbarHandlerService } from '@/app/core/services/error-handler.service';

export class MyComponent {
  notification = inject(SnackbarHandlerService);
  
  saveData() {
    this.service.save(data).subscribe({
      next: () => {
        this.notification.success('Saved successfully!');
      }
      // Error handling is automatic via interceptor
    });
  }
  
  deleteItem() {
    this.notification.warning('File exceeds limit');
  }
}
```

## API Reference

### Methods

#### `success(message: string, config?: NotificationConfig): void`
Display a success message with a 3-second duration by default.

#### `error(error: any, customMessage?: string): void`
Handle and display an error. Automatically extracts error messages from HTTP responses.

#### `warning(message: string, config?: NotificationConfig): void`
Display a warning message with a 5-second duration by default.

#### `info(message: string, config?: NotificationConfig): void`
Display an informational message with a 5-second duration by default.

#### `handle(error: any, customMessage?: string): void`
Alias for `error()` method. Maintained for backward compatibility.

#### `shouldHandleGlobally(error: any): boolean`
Check if an error should be handled globally (returns true for 401, 403, 404, 500+).

The service includes comprehensive unit tests. Run them with:

```bash
npm test -- --include='**/error-handler.service.spec.ts'
```

## Configuration

### Default Settings

```typescript
const defaultConfig = {
  duration: 5000,              // 5 seconds (3 seconds for success)
  action: 'Close',
  horizontalPosition: 'end',
  verticalPosition: 'top',
};
```

### Customizing Messages

To customize messages for specific HTTP status codes, edit the `getHttpErrorMessage()` method in `error-handler.service.ts`.

## Best Practices

1. **Use `notification` as the service name** when injecting for clarity
2. **Always use `notification.success()`** for success messages instead of MatSnackBar
3. **Use `shouldHandleGlobally()`** to check if an error should be handled globally
4. **Keep success messages short** and user-friendly (< 50 characters)
5. **Use `warning()` for validation** or pre-action warnings
6. **Use `info()` for status updates** that aren't errors
7. **Test notification scenarios** to ensure proper user feedback
8. **Don't inject MatSnackBar** directly in components anymore

## Examples

### Complete Component Example

```typescript
import { Component, inject } from '@angular/core';
import { SnackbarHandlerService } from '@/app/core/services/error-handler.service';
import { NovelService } from '@/app/features/novels/novel.service';

@Component({
  selector: 'app-novel-form',
  template: `...`
})
export class NovelFormComponent {
  notification = inject(SnackbarHandlerService);
  novelService = inject(NovelService);

  save(novel: Novel) {
    this.novelService.save(novel).subscribe({
      next: () => {
        this.notification.success('Novel saved successfully!');
      },
      error: (err) => {
        // Global handler takes care of 401, 403, 404, 500+
        if (this.notification.shouldHandleGlobally(err)) {
          return;
        }
        // Custom message for business logic errors
        this.notification.error(err, 'Failed to save novel. Please check your input.');
      }
    });
  }

  delete(id: number) {
    // Show warning before action
    this.notification.warning('Are you sure? This cannot be undone.');
    
    this.novelService.delete(id).subscribe({
      next: () => {
        this.notification.success('Novel deleted!');
      }
      // Errors handled automatically
    });
  }

  checkStatus() {
    this.notification.info('Checking novel status...');
  }
}
```

## Future Enhancements

Potential improvements to consider:

- [ ] Add error logging to external service (e.g., Sentry)
- [ ] Add retry logic for network errors
- [ ] Add offline detection
- [ ] Add error analytics/tracking
- [ ] Add custom error types for better type safety
- [ ] Add internationalization (i18n) support for error messages
