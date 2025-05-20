import { Injectable, signal, inject } from '@angular/core';
import { Hero } from '../interface/hero.interface';
import { DataService } from '@core/services/data.service';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly dataService = inject(DataService);

  private readonly _data = signal<Hero | null>(null);
  readonly data = this._data.asReadonly();

  load(): void {
    this.dataService.getSection<Hero>('hero').subscribe({
      next: (res) => this._data.set(res),
      error: (err) => console.error('Erreur chargement hero:', err),
    });
  }
}
