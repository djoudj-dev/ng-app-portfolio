import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from './menu-item';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);

  // Signals
  readonly expanded = model<boolean>(false); // @model → compatible two-way binding
  readonly expandOnHover = signal<boolean>(true);
  readonly expandedTemporarily = signal<boolean>(false);

  readonly icons = 'icons/navbar/close.svg';

  readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'icons/navbar/menu.svg', route: '/admin', exact: true },
    { label: 'Hero', icon: 'icons/navbar/hero.svg', route: '/admin/hero', exact: false },
    { label: 'Badge disponibilité', icon: 'icons/navbar/badge.svg', route: '/admin/badges', exact: false },
    { label: 'About', icon: 'icons/navbar/about.svg', route: '/admin/about', exact: false },
    { label: 'Stacks', icon: 'icons/navbar/stack.svg', route: '/admin/stacks', exact: false },
    { label: 'Projects', icon: 'icons/navbar/project.svg', route: '/admin/projects', exact: false },
    { label: 'Contact', icon: 'icons/navbar/contact.svg', route: '/admin/contact', exact: false },
  ];

  constructor() {
    effect(() => {
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        if (this.isMobile()) {
          this.expanded.set(false);
        }
      });
    });
  }

  toggleSidebar(): void {
    this.expanded.update((val) => !val);
  }

  setExpanded(value: boolean): void {
    this.expanded.set(value);
  }

  toggleExpandMode(): void {
    this.expandOnHover.update((val) => !val);
    if (!this.expandOnHover()) {
      this.setExpanded(true);
    }
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
