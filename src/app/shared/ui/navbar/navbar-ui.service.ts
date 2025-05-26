import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavbarUiService {
  // UI state signals
  private readonly _menuOpenSignal = signal(false);
  private readonly _settingsModalOpenSignal = signal(false);
  private readonly _loginFormVisibleSignal = signal(false);
  private readonly _settingsPositionSignal = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  // Computed values
  readonly isMenuOpen = computed(() => this._menuOpenSignal());
  readonly isSettingsModalOpen = computed(() => this._settingsModalOpenSignal());
  readonly isLoginFormVisible = computed(() => this._loginFormVisibleSignal());
  readonly settingsPosition = computed(() => this._settingsPositionSignal());

  // Menu methods
  toggleMenu(): void {
    this._menuOpenSignal.update((open) => !open);
  }

  closeMenu(): void {
    this._menuOpenSignal.set(false);
  }

  // Settings modal methods
  toggleSettingsModal(position: { top: number; left: number }): void {
    this._settingsPositionSignal.set(position);
    this._settingsModalOpenSignal.update((open) => !open);

    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }

  closeSettingsModal(): void {
    this._settingsModalOpenSignal.set(false);
  }

  // Login form methods
  showLoginForm(): void {
    this._loginFormVisibleSignal.set(true);
  }

  hideLoginForm(): void {
    this._loginFormVisibleSignal.set(false);
  }

  // Handle outside clicks
  handleOutsideClick(
    target: HTMLElement,
    navbarElement: HTMLElement,
    isSettingsButton: boolean,
    isSettingsModal: boolean
  ): void {
    // Close menu if clicked outside navbar
    if (!navbarElement.contains(target) && this.isMenuOpen()) {
      this.closeMenu();
    }

    // Check if click is inside login modal
    const isLoginModal = !!target.closest('[data-login-modal]');

    // Close settings modal if clicked outside settings button and modal
    if (!isSettingsButton && !isSettingsModal && this.isSettingsModalOpen()) {
      this.closeSettingsModal();
    }

    // Hide login form if clicked outside login modal and not on settings button
    if (!isLoginModal && !isSettingsButton && this.isLoginFormVisible()) {
      this.hideLoginForm();
    }
  }
}
