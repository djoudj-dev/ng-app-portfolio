import { effect, Injectable, signal } from '@angular/core';
import { Toast } from '../../shared/ui/toast/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toast = signal<Toast | null>(null);

  readonly toast = this._toast.asReadonly(); // ✅ Plus de `.asObservable()`, c'est un vrai Signal !

  constructor() {
    effect(() => {
      const currentToast = this._toast();
      if (currentToast?.duration) {
        setTimeout(() => this.hideToast(), currentToast.duration);
      }
    });
  }

  showSuccess(message: string, duration = 3000) {
    this._toast.set({ message, type: 'success', duration });
  }

  showWarning(message: string, duration = 3000) {
    this._toast.set({ message, type: 'warning', duration });
  }

  showError(message: string, duration = 3000) {
    this._toast.set({ message, type: 'error', duration });
  }

  showAuthLogin(message: string, duration = 3000) {
    this._toast.set({ message, type: 'auth-login', duration });
  }

  showAuthLogout(message: string, duration = 3000) {
    this._toast.set({ message, type: 'auth-logout', duration });
  }

  showConfirm(message: string, onConfirm: () => void, onCancel: () => void) {
    this._toast.set({ message, type: 'confirm', onConfirm, onCancel });
  }

  hideToast() {
    this._toast.set(null);
  }
}
