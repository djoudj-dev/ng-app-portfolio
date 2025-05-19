import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ToastService } from '../../../core/toast/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    @if (toastService.toast(); as toast) {
      <div
        class="toast-container bg-background shadow-primary-md rounded-lg"
        [class.inside]="position === 'inside'"
        [ngClass]="getToastTypeClass(toast.type)"
      >
        @if (getIconForType(toast.type)) {
          <div class="toast-icon">
            <img
              [ngSrc]="getIconForType(toast.type)"
              alt="Toast icon"
              width="24"
              height="24"
              class="w-6 h-6 icon-invert"
            />
          </div>
        }
        <div class="toast-content">
          <p class="text-text">{{ toast.message }}</p>
          @if (toast.type === 'confirm') {
            <div class="toast-actions">
              <button (click)="onConfirm()" class="confirm-btn bg-accent-500 hover:bg-accent-600 text-text">
                Confirmer
              </button>
              <button (click)="onCancel()" class="cancel-btn bg-primary-500 hover:bg-primary-600 text-text">
                Annuler
              </button>
            </div>
          }
        </div>
        @if (toast.type !== 'confirm') {
          <button (click)="closeToast()" class="close-btn text-text hover:text-accent-500" aria-label="Fermer">
            ×
          </button>
        }
      </div>
    }
  `,
})
export class ToastComponent {
  @Input() position: 'fixed' | 'inside' = 'fixed';

  readonly toastService = inject(ToastService);

  getToastTypeClass(type: string): string {
    return `toast-${type}`;
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'success':
        return '/icons/admin.svg';
      case 'error':
        return '/icons/close.svg';
      case 'warning':
        return '/icons/menu.svg';
      case 'auth-login':
        return '/icons/login.svg';
      case 'auth-logout':
        return '/icons/logout.svg';
      case 'confirm':
        return '/icons/sun.svg';
      default:
        return '';
    }
  }

  closeToast(): void {
    this.toastService.hideToast();
  }

  onConfirm(): void {
    const toast = this.toastService.toast();
    if (toast?.onConfirm) {
      toast.onConfirm();
    }
    this.toastService.hideToast();
  }

  onCancel(): void {
    const toast = this.toastService.toast();
    if (toast?.onCancel) {
      toast.onCancel();
    }
    this.toastService.hideToast();
  }
}
