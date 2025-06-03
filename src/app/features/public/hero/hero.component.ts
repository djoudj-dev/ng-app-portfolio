import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ScrollService } from '@core/services/scroll.service';
import { HeroService } from '@feat/admin/hero/service/hero.service';
import { FileUrlService } from '@core/services/file-url.service';
import { MetricsService } from '@feat/admin/dashboard/service/metrics.service';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly scrollService = inject(ScrollService);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly metricsService = inject(MetricsService);
  readonly heroService = inject(HeroService);

  readonly hero = computed(() => this.heroService.data());
  readonly loading = computed(() => this.heroService.loading());
  readonly error = computed(() => this.heroService.error());
  readonly downloadCvClick = signal(false);

  constructor() {
    // Charger les données au montage
    this.heroService.load();

    // Effet pour suivre les clics et envoyer les metrics
    effect(() => {
      const clicked = this.downloadCvClick();
      if (!clicked) return;

      const hero = this.hero();
      if (!hero?.id || !hero.cvPath) return;

      this.metricsService.trackCvClick(hero.id).subscribe({
        next: () => {
          const fileUrl = this.fileUrlService.getFileUrl(hero.cvPath);
          window.open(fileUrl, '_blank');
          this.downloadCvClick.set(false); // Reset du signal
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error tracking CV click:', err);
          this.downloadCvClick.set(false); // Toujours reset
        },
      });
    });
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }

  downloadCV(): void {
    this.downloadCvClick.set(true);
  }

  getFileUrl(path: string): string {
    return this.fileUrlService.getFileUrl(path);
  }
}
