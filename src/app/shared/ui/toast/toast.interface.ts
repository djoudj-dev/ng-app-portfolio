export interface Toast {
  message: string;
  type: 'success' | 'error' | 'confirm' | 'warning' | 'info';
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}
