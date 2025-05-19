import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interface/hero.interface';

@Injectable({ providedIn: 'root' })
export class HeroService {
  private readonly http = inject(HttpClient);

  private readonly _data = signal<Hero | null>(null);
  readonly data = this._data.asReadonly();

  load(): void {
    this.http.get<Hero>('http://localhost:3000/hero').subscribe({
      next: (res) => this._data.set(res),
      error: (err) => console.error('Erreur API hero:', err),
    });
  }
}
