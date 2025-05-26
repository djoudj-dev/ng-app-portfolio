import { Component, input, output } from '@angular/core';
import { AuthService } from '@core/auth/service/auth.service';
import { inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { AuthFormService } from '@core/auth/service/auth-form.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [NgOptimizedImage],
})
export class LoginComponent {
  readonly position = input<{ top: number; left: number }>({ top: 0, left: 0 });
  readonly isCompact = input(false);

  readonly closeModal = output<void>();
  readonly loginSuccess = output<void>();

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly errorHandler = inject(ErrorHandlerService);
  readonly formService = inject(AuthFormService);

  login(): void {
    this.formService.setError(null);

    if (!this.formService.isValid()) {
      const msg = 'Veuillez remplir tous les champs.';
      this.formService.setError(msg);
      this.toastService.showInfo(msg);
      return;
    }

    this.formService.setLoading(true);

    this.authService.login(this.formService.form()).subscribe({
      next: (success) => {
        this.formService.setLoading(false);

        if (success) {
          this.loginSuccess.emit();
          this.close();
        } else {
          this.formService.setError('Identifiants invalides. Veuillez réessayer.');
        }
      },
      error: (error) => {
        this.formService.setLoading(false);
        const message = this.errorHandler.handleAuthError(error);
        this.formService.setError(message);
      },
    });
  }

  // Form event handlers directly exposed from formService
  readonly updateEmail = (event: Event): void => this.formService.updateEmail(event);
  readonly updatePassword = (event: Event): void => this.formService.updatePassword(event);
  readonly updateRememberMe = (event: Event): void => this.formService.updateRememberMe(event);
  readonly togglePasswordVisibility = (): void => this.formService.togglePasswordVisibility();

  forgotPassword(): void {
    console.log('Mot de passe oublié ?');
  }

  close(): void {
    this.formService.resetForm();
    this.closeModal.emit();
  }
}
