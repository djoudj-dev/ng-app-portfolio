import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
  effect,
  AfterViewInit,
  runInInjectionContext,
  inject,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <app-sidebar #sidebar (expandedChange)="onSidebarExpandedChange($event)" />
    <div
      class="admin-container p-5 bg-background min-h-screen"
      [class.ml-16]="!sidebarExpanded()"
      [class.ml-64]="sidebarExpanded()"
    >
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 20px;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        background-color: var(--color-background);
        min-height: 100vh;
      }

      @media (max-width: 768px) {
        .admin-container {
          margin-left: 0 !important;
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: SidebarComponent;
  private readonly injector = inject(Injector);

  sidebarExpanded = signal<boolean>(false);

  ngAfterViewInit(): void {
    // Initial state from sidebar
    this.sidebarExpanded.set(this.sidebar.expanded());

    // Setup effect to watch sidebar expanded state changes
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.sidebarExpanded.set(this.sidebar.expanded());
      });
    });
  }

  // Event handler for sidebar expanded changes
  onSidebarExpandedChange(expanded: boolean): void {
    this.sidebarExpanded.set(expanded);
  }
}
