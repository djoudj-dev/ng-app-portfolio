import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NavigationItem } from './navigation-item.interface';
import { ThemeService } from '../../../core/theme/theme.service';
import { NAVIGATION_ITEMS } from './navigation-items.constant';
import { ScrollService } from '../../../core/scroll/scroll.service';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterLink, NgOptimizedImage, BadgeComponent],
})
export class NavbarComponent {
  private readonly navigationItemsSignal = signal<NavigationItem[]>(NAVIGATION_ITEMS);
  readonly navigationItems = this.navigationItemsSignal.asReadonly();

  private readonly themeService = inject(ThemeService);
  private readonly scrollService = inject(ScrollService);
  private readonly el = inject(ElementRef);

  private readonly _menuOpenSignal = signal(false);

  readonly isMenuOpen = computed(() => this._menuOpenSignal());
  readonly isDarkMode = computed(() => this.themeService.isDarkMode());

  toggleMenu(): void {
    this._menuOpenSignal.update((open) => !open);
  }

  closeMenu(): void {
    this._menuOpenSignal.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async scrollToSection(fragment: string | undefined): Promise<void> {
    await this.scrollService.scrollToSection(fragment || '');
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target) && this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
