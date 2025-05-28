import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { ScrollService } from '@core/services/scroll.service';
import { HeroService } from '@feat/admin/hero/service/hero.service';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit {
  private readonly scrollService = inject(ScrollService);
  private readonly fileUrlService = inject(FileUrlService);
  readonly heroService = inject(HeroService);

  readonly hero = computed(() => this.heroService.data());
  readonly loading = computed(() => this.heroService.loading());
  readonly error = computed(() => this.heroService.error());

  ngOnInit(): void {
    this.heroService.load();
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }

  downloadCV(): void {
    const hero = this.hero();
    if (hero && hero.cvPath) {
      const fileUrl = this.fileUrlService.getFileUrl(hero.cvPath);
      window.open(fileUrl, '_blank');
    }
  }

  getFileUrl(path: string): string {
    return this.fileUrlService.getFileUrl(path);
  }
}
