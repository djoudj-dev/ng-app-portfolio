import { inject, Injectable, signal } from '@angular/core';
import { About } from '../interface/about.interface';
import { DataService } from '@core/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly dataService = inject(DataService);

  private readonly _data = signal<About | null>(null);
  readonly data = this._data.asReadonly();

  load(): void {
    this.dataService.getSection<About>('about').subscribe({
      next: (res) => this._data.set(res),
      error: (err) => console.error('Erreur chargement about:', err),
    });
  }
}
