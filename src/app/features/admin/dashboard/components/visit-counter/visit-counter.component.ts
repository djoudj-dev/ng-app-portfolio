import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visit-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8 p-5 bg-background rounded-lg border border-gray-400 mb-8">
      <h2 class="text-text text-xl font-semibold mb-4">Résumé des visites</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <!-- Visiteurs réels -->
        <div class="p-4 bg-background rounded-lg border border-primary-200">
          <h3 class="text-lg font-medium text-text">Visiteurs réels</h3>
          <p class="text-3xl font-bold text-primary">{{ realUsers.toLocaleString() }}</p>
          <p class="text-sm text-text">{{ realUserPercentage }}% du total</p>
        </div>

        <!-- Visites des bots -->
        <div class="p-4 bg-background rounded-lg border border-primary-200">
          <h3 class="text-lg font-medium text-text">Visites des bots</h3>
          <p class="text-3xl font-bold text-secondary">{{ bots.toLocaleString() }}</p>
          <p class="text-sm text-text">{{ botPercentage }}% du total</p>
        </div>

        <!-- Téléchargements CV -->
        <div class="p-4 bg-background rounded-lg border border-primary-200">
          <h3 class="text-lg font-medium text-text">Téléchargements CV</h3>
          <p class="text-3xl font-bold text-green-500">{{ cvClicks.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCounterComponent {
  visitCount = input<() => number>();
  realUserCount = input<() => number>();
  botCount = input<() => number>();
  cvClickCount = input<() => number>();

  get totalVisits(): number {
    return this.visitCount()?.() ?? 0;
  }

  get realUsers(): number {
    return this.realUserCount()?.() ?? 0;
  }

  get bots(): number {
    return this.botCount()?.() ?? 0;
  }

  get realUserPercentage(): string {
    const total = this.totalVisits;
    return total > 0 ? ((this.realUsers / total) * 100).toFixed(1) : '0.0';
  }

  get botPercentage(): string {
    const total = this.totalVisits;
    return total > 0 ? ((this.bots / total) * 100).toFixed(1) : '0.0';
  }

  get cvClicks(): number {
    return this.cvClickCount()?.() ?? 0;
  }
}
