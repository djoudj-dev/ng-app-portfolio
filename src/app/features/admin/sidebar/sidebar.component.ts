import { ChangeDetectionStrategy, Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  template: `
    <aside
      class="fixed left-0 top-0 h-full bg-background text-text shadow-primary-md z-20 overflow-hidden"
      [ngClass]="{
        'w-[250px]': expanded(),
        'w-[64px]': !expanded(),
      }"
      (mouseenter)="expandOnHover ? setExpanded(true) : null"
      (mouseleave)="expandOnHover ? setExpanded(false) : null"
    >
      <!-- Header -->
      <div class="p-4 flex items-center justify-between">
        <h2 class="text-xl font-bold whitespace-nowrap overflow-hidden">
          {{ expanded() ? 'Admin Panel' : 'A' }}
        </h2>
        <button
          class="text-text hover:text-accent focus:outline-none"
          (click)="toggleSidebar()"
          aria-label="Toggle sidebar"
        ></button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6">
        <ul class="space-y-2 px-2">
          @for (item of menuItems; track item.label) {
            <li>
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-primary text-text shadow-accent-md"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="flex items-center p-3 rounded-lg hover:bg-background transition-colors"
              >
                <img
                  [ngSrc]="item.icon"
                  class="icon-container flex-shrink-0 icon-invert"
                  [alt]="item.label"
                  width="24"
                  height="24"
                />
                <span
                  class="ml-3 whitespace-nowrap overflow-hidden transition-opacity duration-300"
                  [class.opacity-0]="!expanded() && !expandedTemporarily"
                  >{{ item.label }}</span
                >
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Expand/Collapse Toggle -->
      <div class="absolute bottom-4 left-0 right-0 px-4">
        <button
          class="w-full flex items-center justify-center p-2 rounded-lg bg-accent hover:bg-primary-600 transition-colors"
          (click)="toggleExpandMode()"
        >
          <img
            [ngSrc]="icons"
            fill
            class="w-6 aspect-square object-contain icon-invert"
            alt="Changer le mode d’expansion du menu"
          />

          <span
            class="ml-2 text-text whitespace-nowrap overflow-hidden transition-opacity duration-300"
            [class.opacity-0]="!expanded()"
          >
            {{ expandOnHover ? 'Bloquer le menu' : 'Débloquer le menu' }}
          </span>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    @if (expanded() && isMobile()) {
      <div class="fixed inset-0 bg-background bg-opacity-50 z-30" (click)="setExpanded(false)"></div>
    }
  `,
  styles: [
    `
      .icon-container {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-container svg {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private router = inject(Router);

  expanded = signal<boolean>(false);
  expandOnHover = true;
  expandedTemporarily = false;
  icons = 'icons/navbar/close.svg';

  @Output() expandedChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'icons/navbar/menu.svg',
      route: '/admin',
      exact: true,
    },
    {
      label: 'Hero',
      icon: 'icons/navbar/hero.svg',
      route: '/admin/hero',
      exact: false,
    },
    {
      label: 'About',
      icon: 'icons/navbar/about.svg',
      route: '/admin/about',
      exact: false,
    },
    {
      label: 'Stacks',
      icon: 'icons/navbar/stack.svg',
      route: '/admin/stacks',
      exact: false,
    },
    {
      label: 'Projects',
      icon: 'icons/navbar/project.svg',
      route: '/admin/projects',
      exact: false,
    },
    {
      label: 'Contact',
      icon: 'icons/navbar/contact.svg',
      route: '/admin/contact',
      exact: false,
    },
  ];

  constructor() {
    // Close sidebar on route change on mobile
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isMobile()) {
        this.setExpanded(false);
      }
    });
  }

  toggleSidebar(): void {
    const newValue = !this.expanded();
    this.expanded.set(newValue);
    this.expandedChange.emit(newValue);
  }

  setExpanded(value: boolean): void {
    if (this.expanded() !== value) {
      this.expanded.set(value);
      this.expandedChange.emit(value);
    }
  }

  toggleExpandMode(): void {
    this.expandOnHover = !this.expandOnHover;
    if (!this.expandOnHover) {
      this.setExpanded(true);
    } else if (this.expanded()) {
      this.expandedChange.emit(true);
    }
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}
