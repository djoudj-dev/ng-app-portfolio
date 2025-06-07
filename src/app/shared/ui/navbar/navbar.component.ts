import { Component, computed, signal } from '@angular/core';
import { inject } from '@angular/core';
import { NavigationItem } from '@shared/ui/navbar/navigation-item.interface';
import { ThemeService } from '@core/services/theme.service';
import { NAVIGATION_ITEMS } from '@shared/ui/navbar/navigation-items.constant';
import { ScrollService } from '@core/services/scroll.service';
import { NavbarUiService } from './navbar-ui.service';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '@feat/public/badge/badge.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [NgOptimizedImage, RouterLink, BadgeComponent],
})
export class NavbarComponent {
  private readonly navigationItemsSignal = signal<NavigationItem[]>(NAVIGATION_ITEMS);

  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);
  private readonly uiService = inject(NavbarUiService);

  readonly navigationItems = this.navigationItemsSignal.asReadonly();
  readonly isMenuOpen = this.uiService.isMenuOpen;
  readonly isDarkMode = computed(() => this.themeService.isDarkMode());

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
}
