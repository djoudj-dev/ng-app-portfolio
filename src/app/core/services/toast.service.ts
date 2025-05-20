import { effect, Injectable, signal } from '@angular/core';
import { Toast } from '@shared/ui/toast/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toast = signal<Toast | null>(null);

  readonly toast = this._toast.asReadonly();

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
  showError(message: string, duration = 3000) {
    this._toast.set({ message, type: 'error', duration });
  }
  hideToast() {
    this._toast.set(null);
  }
}
