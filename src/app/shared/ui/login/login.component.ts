import { Component, effect, inject, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '@core/auth/service/auth.service';
import { ToastService } from '@core/services/toast.service';
import { AuthFormService } from '@core/auth/service/auth-form.service';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage],
  templateUrl: './login.component.html',
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

  readonly shouldLogin = signal(false);
  readonly formId = crypto.randomUUID();

  readonly onEmailInput = (e: Event) => this.formService.updateEmail((e.target as HTMLInputElement).value);

  readonly onPasswordInput = (e: Event) => this.formService.updatePassword((e.target as HTMLInputElement).value);

  readonly onRememberChange = (e: Event) => this.formService.updateRememberMe((e.target as HTMLInputElement).checked);

  constructor() {
    effect(() => {
      if (!this.shouldLogin()) return;

      this.formService.setLoading(true);
      this.formService.setError(null);

      this.authService
        .login(this.formService.form())
        .pipe(
          tap((success) => {
            this.formService.setLoading(false);
            if (success) {
              this.loginSuccess.emit();
              this.close();
            } else {
              this.formService.setError('Identifiants invalides. Veuillez réessayer.');
            }
          }),
          catchError((err) => {
            this.formService.setLoading(false);
            const msg = this.errorHandler.handleAuthError(err);
            this.formService.setError(msg);
            return of(null);
          }),
          finalize(() => this.shouldLogin.set(false))
        )
        .subscribe();
    });
  }

  login(): void {
    if (!this.formService.isValid()) {
      const msg = 'Veuillez remplir tous les champs.';
      this.formService.setError(msg);
      this.toastService.showInfo(msg);
      return;
    }

    this.shouldLogin.set(true);
  }

  close(): void {
    this.formService.resetForm();
    this.closeModal.emit();
  }

  forgotPassword(): void {
    console.log('Mot de passe oublié ?');
    this.toastService.showInfo('Lien de réinitialisation à venir 😉');
  }
}
