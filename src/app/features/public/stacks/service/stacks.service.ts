import { Injectable, inject, signal } from '@angular/core';
import { Category, HardSkills, SoftSkills } from '../interface/stacks.interface';
import { DataService } from '@core/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class StacksService {
  private readonly dataService = inject(DataService);

  // Signals pour stocker les données
  private readonly _categories = signal<Category[]>([]);
  private readonly _hardSkills = signal<HardSkills[]>([]);
  private readonly _softSkills = signal<SoftSkills[]>([]);

  // Exposer les données en lecture seule
  readonly categories = this._categories.asReadonly();
  readonly hardSkills = this._hardSkills.asReadonly();
  readonly softSkills = this._softSkills.asReadonly();

  load(): void {
    this.dataService
      .getSection<{
        categories: Category[];
        hardskills: HardSkills[];
        softskills: SoftSkills[];
      }>('stacks')
      .subscribe({
        next: (res) => {
          this._categories.set(res.categories);
          this._hardSkills.set(res.hardskills);
          this._softSkills.set(res.softskills);
        },
        error: (err) => console.error('Erreur chargement stacks:', err),
      });
  }
}
