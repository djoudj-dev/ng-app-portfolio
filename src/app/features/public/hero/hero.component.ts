import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { ScrollService } from '@core/services/scroll.service';
import { FileUrlService } from '@core/services/file-url.service';
import { MetricsService } from '@feat/admin/dashboard/service/metrics.service';
import { DATA_HERO } from '@feat/public/hero/data/hero.data';
import { Hero } from '@feat/public/hero/interface/hero.interface';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly scrollService = inject(ScrollService);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly metricsService = inject(MetricsService);

  readonly hero: Hero = DATA_HERO;
  readonly cvPath = 'docs/CV_DEVELOPPEUR_ANGULAR_NEDELLEC_JULIEN.pdf';
  readonly downloadCvClick = signal(false);

  downloadCV(): void {
    this.metricsService.trackCvClick('static-hero').subscribe({
      next: () => {
        const fileUrl = this.fileUrlService.getFileUrl(this.cvPath);
        window.open(fileUrl, '_blank');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }
}
