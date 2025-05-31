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
    <app-sidebar #sidebar [(expanded)]="sidebarOpen" />
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: SidebarComponent;
  private readonly injector = inject(Injector);

  sidebarExpanded = signal<boolean>(false);
  sidebarOpen = signal<boolean>(true);

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

  onSidebarExpandedChange(expanded: boolean): void {
    this.sidebarExpanded.set(expanded);
  }
}
