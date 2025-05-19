import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { About } from '../interface/about.interface';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly http = inject(HttpClient);

  private readonly _data = signal<About | null>(null);
  readonly data = this._data.asReadonly();

  load(): void {
    this.http.get<About>('http://localhost:3000/about').subscribe({
      next: (res) => this._data.set(res),
      error: (err) => console.error('Erreur API about:', err),
    });
  }
}
