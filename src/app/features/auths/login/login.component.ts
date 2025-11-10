import { FormErrorService } from '@/app/shared/services/form-error.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ErrorMessageService } from '@/app/shared/services/error-message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    AuthLayoutComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  formErrorService = inject(FormErrorService);
  authService = inject(AuthService);
  errorMessageService = inject(ErrorMessageService);

  loginLoading = signal(false);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get emailCtrl() {
    return this.loginForm.get('email');
  }

  get passwordCtrl() {
    return this.loginForm.get('password');
  }
  getError(controlName: 'email' | 'password'): string {
    const control = this.loginForm.get(controlName);
    return this.formErrorService.getErrorMessage(control, controlName);
  }

  errorMessage = signal('');
  onSubmit() {
    if (
      this.loginForm.invalid ||
      !this.emailCtrl?.value ||
      !this.passwordCtrl?.value
    ) {
      return;
    }

    this.errorMessage.set('');
    this.loginLoading.set(true);
    this.authService
      .login({
        email: this.emailCtrl.value,
        password: this.passwordCtrl.value,
      })
      .pipe(finalize(() => this.loginLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/upload-epub']);
        },
        error: (err) => {
          const backendMsg =
            err.error?.message || err.message || 'Something went wrong';
          this.errorMessage.set(
            this.errorMessageService.getMessage(backendMsg)
          );
        },
      });
  }
}
