export interface Toast {
  message: string;
  type: 'success' | 'error' | 'confirm' | 'warning' | 'auth-login' | 'auth-logout';
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}
