import { Injectable, signal, computed } from '@angular/core';
import { LoginCredentials } from '@core/auth/interface/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthFormService {
  readonly email = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly passwordVisible = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly isValid = computed(() => this.email().trim() !== '' && this.password().trim() !== '');

  readonly form = computed<LoginCredentials>(() => ({
    email: this.email(),
    password: this.password(),
    rememberMe: this.rememberMe(),
  }));

  // Methods
  updateEmail(value: string): void {
    this.email.set(value);
  }

  updatePassword(value: string): void {
    this.password.set(value);
  }

  updateRememberMe(value: boolean): void {
    this.rememberMe.set(value);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  setError(message: string | null): void {
    this.errorMessage.set(message);
  }

  setLoading(state: boolean): void {
    this.isLoading.set(state);
  }

  resetForm(): void {
    this.email.set('');
    this.password.set('');
    this.rememberMe.set(false);
    this.passwordVisible.set(false);
    this.errorMessage.set(null);
    this.isLoading.set(false);
  }
}
