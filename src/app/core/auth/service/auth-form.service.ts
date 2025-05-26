import { Injectable, signal, computed } from '@angular/core';
import { LoginCredentials } from '@core/auth/interface/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthFormService {
  // Form state signals
  readonly email = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly passwordVisible = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  // Computed values
  readonly isValid = computed(() => this.email().trim() !== '' && this.password().trim() !== '');
  readonly inputType = computed(() => (this.passwordVisible() ? 'text' : 'password'));
  readonly form = computed<LoginCredentials>(() => ({
    email: this.email(),
    password: this.password(),
    rememberMe: this.rememberMe(),
  }));

  // Form methods
  updateEmail(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }

  updateRememberMe(event: Event): void {
    this.rememberMe.set((event.target as HTMLInputElement).checked);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  setError(message: string | null): void {
    this.errorMessage.set(message);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
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
