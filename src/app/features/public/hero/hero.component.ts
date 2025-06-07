import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { DATA_HERO } from '@feat/public/hero/data/hero.data';
import { Hero } from '@feat/public/hero/interface/hero.interface';
import { ScrollService } from '@core/services/scroll.service';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly scrollService = inject(ScrollService);

  readonly hero: Hero = DATA_HERO;

  downloadCV(): void {
    window.open(this.hero.cvPath, '_blank');
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }
}
