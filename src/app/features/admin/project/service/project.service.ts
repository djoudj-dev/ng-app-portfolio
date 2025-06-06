import { Injectable, inject, signal } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable, tap, map, of } from 'rxjs';
import { Project, ProjectCategory, ProjectTechnology } from '@feat/admin/project/interface/project.interface';
import { PROJECT_TECHNOLOGIES } from '@feat/admin/project/data/project-technologies.data';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly httpAdapter = inject(HttpAdapterService);

  // Signals pour stocker les données
  projects = signal<Project[]>([]);
  categories = signal<ProjectCategory[]>([]);
  technologies = signal<ProjectTechnology[]>([]);

  // Récupérer tous les projets, catégories et technologies
  getProjects(): Observable<Project[]> {
    return this.httpAdapter.get<{ projects: Project[]; categories: ProjectCategory[] }>('/projects').pipe(
      tap((response) => {
        if (response.projects) {
          this.projects.set(response.projects);
        }
        if (response.categories) {
          this.categories.set(response.categories);
        }

        // Récupérer les technologies également
        this.getTechnologies().subscribe();
      }),
      map((response) => response.projects)
    );
  }

  // Récupérer un projet par ID
  getProject(id: string): Observable<Project> {
    return this.httpAdapter.get<Project>(`/projects/${id}`);
  }

  // Créer un nouveau projet
  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.httpAdapter.post<Project>('/projects', project).pipe(
      tap((newProject) => {
        const currentProjects = this.projects();
        this.projects.set([...currentProjects, newProject]);
      })
    );
  }

  // Mettre à jour un projet
  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.httpAdapter.patch<Project>(`/projects/${id}`, project).pipe(
      tap((updatedProject) => {
        const currentProjects = this.projects();
        const index = currentProjects.findIndex((p) => p.id === id);
        if (index !== -1) {
          const updatedProjects = [...currentProjects];
          updatedProjects[index] = updatedProject;
          this.projects.set(updatedProjects);
        }
      })
    );
  }

  // Supprimer un projet
  deleteProject(id: string): Observable<Project> {
    return this.httpAdapter.delete<Project>(`/projects/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projects();
        this.projects.set(currentProjects.filter((p) => p.id !== id));
      })
    );
  }

  // Upload d'image générique (sans association à un projet)
  uploadImage(file: File): Observable<{ filename: string; path: string; mimetype: string }> {
    return this.httpAdapter.uploadFile<{ filename: string; path: string; mimetype: string }>(
      '/projects/upload-image',
      file,
      {}
    );
  }

  // Upload d'image pour un projet spécifique
  uploadProjectImage(id: string, file: File): Observable<Project> {
    return this.httpAdapter.patchFile<Project>(`/projects/${id}/image`, file);
  }

  // Récupérer toutes les catégories
  getCategories(): Observable<ProjectCategory[]> {
    return this.httpAdapter.get<ProjectCategory[]>('/projects/categories').pipe(
      tap((categories) => {
        this.categories.set(categories);
      })
    );
  }

  // Récupérer une catégorie par ID
  getCategoryById(id: string): Observable<ProjectCategory> {
    return this.httpAdapter.get<ProjectCategory>(`/projects/categories/${id}`);
  }

  // Créer une nouvelle catégorie
  createCategory(category: { label: string; icon: string }): Observable<ProjectCategory> {
    return this.httpAdapter.post<ProjectCategory>('/projects/categories', category).pipe(
      tap((newCategory) => {
        const currentCategories = this.categories();
        this.categories.set([...currentCategories, newCategory]);
      })
    );
  }

  // Mettre à jour une catégorie
  updateCategory(id: string, category: Partial<{ label: string; icon: string }>): Observable<ProjectCategory> {
    return this.httpAdapter.patch<ProjectCategory>(`/projects/categories/${id}`, category).pipe(
      tap((updatedCategory) => {
        const currentCategories = this.categories();
        const index = currentCategories.findIndex((c) => c.id === id);
        if (index !== -1) {
          const updatedCategories = [...currentCategories];
          updatedCategories[index] = updatedCategory;
          this.categories.set(updatedCategories);
        }
      })
    );
  }

  // Supprimer une catégorie
  deleteCategory(id: string): Observable<ProjectCategory> {
    return this.httpAdapter.delete<ProjectCategory>(`/projects/categories/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categories();
        this.categories.set(currentCategories.filter((c) => c.id !== id));
      })
    );
  }

  // Récupérer l'image d'un projet par ID
  getProjectImage(id: string): Observable<Blob> {
    return this.httpAdapter.getBinary(`/projects/${id}/image`);
  }

  // Récupérer une image par son nom de fichier
  getImageByFilename(filename: string): Observable<Blob> {
    return this.httpAdapter.getBinary(`/projects/images/${filename}`);
  }

  // Récupérer toutes les technologies
  getTechnologies(): Observable<ProjectTechnology[]> {
    // Utiliser les données statiques au lieu de faire une requête HTTP
    return of(PROJECT_TECHNOLOGIES).pipe(
      tap((technologies) => {
        this.technologies.set(technologies);
      })
    );
  }

  // Récupérer une technologie par ID
  getTechnologyById(id: string): Observable<ProjectTechnology> {
    const technology = PROJECT_TECHNOLOGIES.find((tech) => tech.id === id);
    if (!technology) {
      return of({ id, label: id, icon: 'icons/stacks/default.svg' });
    }
    return of(technology);
  }

  // Créer une nouvelle technologie
  createTechnology(technology: { label: string; icon: string }): Observable<ProjectTechnology> {
    // Générer un ID unique basé sur le timestamp
    const id = `tech-${Date.now()}`;
    const newTechnology: ProjectTechnology = {
      id,
      label: technology.label,
      icon: technology.icon || 'icons/stacks/default.svg',
    };

    // Mettre à jour le signal avec la nouvelle technologie
    const currentTechnologies = this.technologies();
    this.technologies.set([...currentTechnologies, newTechnology]);

    return of(newTechnology);
  }

  // Mettre à jour une technologie
  updateTechnology(id: string, technology: Partial<{ label: string; icon: string }>): Observable<ProjectTechnology> {
    const currentTechnologies = this.technologies();
    const index = currentTechnologies.findIndex((t) => t.id === id);

    if (index === -1) {
      // Si la technologie n'existe pas, retourner une erreur
      return of({ id, label: id, icon: 'icons/stacks/default.svg' });
    }

    // Créer une technologie mise à jour
    const updatedTechnology: ProjectTechnology = {
      ...currentTechnologies[index],
      ...technology,
    };

    // Mettre à jour le signal
    const updatedTechnologies = [...currentTechnologies];
    updatedTechnologies[index] = updatedTechnology;
    this.technologies.set(updatedTechnologies);

    return of(updatedTechnology);
  }

  // Supprimer une technologie
  deleteTechnology(id: string): Observable<ProjectTechnology> {
    const currentTechnologies = this.technologies();
    const technology = currentTechnologies.find((t) => t.id === id);

    if (!technology) {
      return of({ id, label: id, icon: 'icons/stacks/default.svg' });
    }

    // Mettre à jour le signal en filtrant la technologie supprimée
    this.technologies.set(currentTechnologies.filter((t) => t.id !== id));

    return of(technology);
  }
}
