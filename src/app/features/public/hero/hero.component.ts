import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { ScrollService } from '@core/services/scroll.service';
import { FileUrlService } from '@core/services/file-url.service';
import { MetricsService } from '@feat/admin/dashboard/service/metrics.service';
import { DATA_HERO } from '@feat/public/hero/data/hero.data';
import { Hero } from '@feat/public/hero/interface/hero.interface';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly scrollService = inject(ScrollService);
  private readonly fileUrlService = inject(FileUrlService);
  private readonly metricsService = inject(MetricsService);

  readonly hero: Hero = DATA_HERO;

  downloadCV(): void {
    // Track CV click and open the file
    this.metricsService.trackCvClick('static-hero').subscribe({
      next: () => {
        const fileUrl = this.fileUrlService.getFileUrl('/cv');
        window.open(fileUrl, '_blank');
      },
      error: (err) => {
        console.error(err);
      },
    });

    // We can also access the cvClickCount signal directly if needed
    // const currentClicks = this.metricsService.cvClickCount();
    // console.log(`CV has been clicked ${currentClicks} times`);
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }
}
