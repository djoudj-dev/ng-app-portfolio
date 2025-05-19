import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { NgOptimizedImage } from '@angular/common';
import { ScrollService } from '../../../core/scroll/scroll.service';
import { HeroService } from './service/hero.service';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit {
  private readonly scrollService = inject(ScrollService);
  private readonly heroService = inject(HeroService);

  readonly hero = computed(() => this.heroService.data());

  ngOnInit(): void {
    this.heroService.load();
  }

  scrollToSection(fragment: string): Promise<void> {
    return this.scrollService.scrollToSection(fragment);
  }

  downloadCV(): void {
    const hero = this.hero();
    if (hero) window.open(hero.cvPath, '_blank');
  }
}
