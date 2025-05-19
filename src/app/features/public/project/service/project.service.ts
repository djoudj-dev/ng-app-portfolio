import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../interface/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  // Signal pour stocker plusieurs projets
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  load(): void {
    this.http.get<{ project: Project[] }>('http://localhost:3000/projects').subscribe({
      next: (res) => this._projects.set(res.project), // Assurez-vous d'accéder à la clé correcte
      error: (err) => console.error('Erreur API project:', err),
    });
  }
}
