import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-background pt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row gap-6">
          <!-- Admin Navigation Menu -->
          <aside class="w-full sm:w-64 mb-6 sm:mb-0">
            <nav class="bg-background shadow-accent-md rounded-lg p-4 border border-gray-400">
              <div class="space-y-2">
                <a
                  routerLink="/admin"
                  [routerLinkActiveOptions]="{ exact: true }"
                  routerLinkActive="bg-accent-500 text-text"
                  class="flex items-center px-4 py-3 text-text rounded-lg hover:bg-accent-400 hover:text-accent transition-colors"
                >
                  <span class="mx-auto sm:mx-0">Dashboard</span>
                </a>

                <a
                  routerLink="/admin/projects"
                  routerLinkActive="bg-accent-500 text-text"
                  class="flex items-center px-4 py-3 text-text rounded-lg hover:bg-accent hover:text-accent transition-colors"
                >
                  <span class="mx-auto sm:mx-0">Projects</span>
                </a>

                <a
                  routerLink="/admin/messages"
                  routerLinkActive="bg-accent-500 text-text"
                  class="flex items-center px-4 py-3 text-text rounded-lg hover:bg-accent hover:text-accent transition-colors"
                >
                  <span class="mx-auto sm:mx-0">Messages</span>
                </a>

                <a
                  routerLink="/admin/badges"
                  routerLinkActive="bg-accent-500 text-text"
                  class="flex items-center px-4 py-3 text-text rounded-lg hover:bg-accent hover:text-accent transition-colors"
                >
                  <span class="mx-auto sm:mx-0">Badges</span>
                </a>
              </div>
            </nav>
          </aside>

          <!-- Main Content Area -->
          <main class="flex-1 bg-background  shadow-accent-md rounded-lg p-6 border border-gray-400">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}
