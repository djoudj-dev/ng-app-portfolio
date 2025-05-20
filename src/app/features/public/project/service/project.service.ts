import { inject, Injectable, signal } from '@angular/core';
import { Project } from '@feat/public/project/interface/project.interface';
import { DataService } from '@core/services/data.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly dataService = inject(DataService);

  // Signal pour stocker plusieurs projets
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  load(): void {
    this.dataService.getSection<{ project: Project[] }>('projects').subscribe({
      next: (res) => this._projects.set(res.project), // Assurez-vous d'accéder à la clé correcte
      error: (err) => console.error('Erreur chargement projects:', err),
    });
  }
}
