import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { inject } from '@angular/core';
import { NavigationItem } from '@shared/ui/navbar/navigation-item.interface';
import { ThemeService } from '@core/services/theme.service';
import { NAVIGATION_ITEMS } from '@shared/ui/navbar/navigation-items.constant';
import { ScrollService } from '@core/services/scroll.service';
import { AuthService } from '@core/auth/service/auth.service';
import { AuthFormService } from '@core/auth/service/auth-form.service';
import { NavbarUiService } from './navbar-ui.service';
import { NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@shared/ui/login/login.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [NgOptimizedImage, LoginComponent, BadgeComponent, RouterLink],
})
export class NavbarComponent {
  private readonly navigationItemsSignal = signal<NavigationItem[]>(NAVIGATION_ITEMS);
  readonly navigationItems = this.navigationItemsSignal.asReadonly();

  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);
  private readonly authService = inject(AuthService);
  private readonly authFormService = inject(AuthFormService);
  private readonly el = inject(ElementRef);
  private readonly uiService = inject(NavbarUiService);

  // Expose UI state from service
  readonly isMenuOpen = this.uiService.isMenuOpen;
  readonly isSettingsModalOpen = this.uiService.isSettingsModalOpen;
  readonly isLoginFormVisible = this.uiService.isLoginFormVisible;
  readonly settingsPosition = this.uiService.settingsPosition;

  // Computed values
  readonly isDarkMode = computed(() => this.themeService.isDarkMode());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  toggleMenu(): void {
    this.uiService.toggleMenu();
  }

  closeMenu(): void {
    this.uiService.closeMenu();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async scrollToSection(fragment: string | undefined): Promise<void> {
    await this.scrollService.scrollToSection(fragment || '');
    this.closeMenu();
  }

  toggleSettingsModal(): void {
    const button = this.el.nativeElement.querySelector('#settings-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      this.uiService.toggleSettingsModal({ top: rect.bottom + 8, left: rect.left });
    }
  }

  closeSettingsModal(): void {
    this.uiService.closeSettingsModal();
  }

  showLoginForm(): void {
    this.authFormService.resetForm();
    this.uiService.showLoginForm();
  }

  hideLoginForm(): void {
    this.uiService.hideLoginForm();
  }

  handleLoginSuccess(): void {
    this.hideLoginForm();
    this.closeSettingsModal();
  }

  logout(): void {
    this.authService.logout();
    this.closeSettingsModal();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isSettingsButton = !!target.closest('[data-settings-button]');
    const isSettingsModal = !!target.closest('[data-settings-modal]');

    this.uiService.handleOutsideClick(target, this.el.nativeElement, isSettingsButton, isSettingsModal);
  }
}
