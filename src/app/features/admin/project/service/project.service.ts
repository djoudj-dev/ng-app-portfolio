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

  projects = signal<Project[]>([]);
  categories = signal<ProjectCategory[]>([]);
  technologies = signal<ProjectTechnology[]>([]);

  getProjects(): Observable<Project[]> {
    return this.httpAdapter.get<{ projects: Project[]; categories: ProjectCategory[] }>('/projects').pipe(
      tap((response) => {
        this.projects.set(response.projects ?? []);
        this.categories.set(response.categories ?? []);
        this.getTechnologies().subscribe();
      }),
      map((res) => res.projects)
    );
  }

  getProject(id: string): Observable<Project> {
    return this.httpAdapter.get<Project>(`/projects/${id}`);
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.httpAdapter.post<Project>('/projects', project).pipe(
      tap((newProject) => {
        const currentProjects = this.projects();
        this.projects.set([...currentProjects, newProject]);
      })
    );
  }

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

  deleteProject(id: string): Observable<Project> {
    return this.httpAdapter.delete<Project>(`/projects/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projects();
        this.projects.set(currentProjects.filter((p) => p.id !== id));
      })
    );
  }

  uploadProjectImage(id: string, file: File): Observable<Project> {
    return this.httpAdapter.patchFile<Project>(`/projects/${id}/image`, file);
  }

  getCategories(): Observable<ProjectCategory[]> {
    return this.httpAdapter.get<ProjectCategory[]>('/projects/categories').pipe(
      tap((categories) => {
        this.categories.set(categories);
      })
    );
  }

  createCategory(category: { label: string; icon: string }): Observable<ProjectCategory> {
    return this.httpAdapter.post<ProjectCategory>('/projects/categories', category).pipe(
      tap((newCategory) => {
        const currentCategories = this.categories();
        this.categories.set([...currentCategories, newCategory]);
      })
    );
  }

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

  getTechnologies(): Observable<ProjectTechnology[]> {
    return of(PROJECT_TECHNOLOGIES).pipe(
      tap((technologies) => {
        this.technologies.set(technologies);
      })
    );
  }

  createTechnology(technology: { label: string; icon: string }): Observable<ProjectTechnology> {
    const id = `tech-${Date.now()}`;
    const newTechnology: ProjectTechnology = {
      id,
      label: technology.label,
      icon: technology.icon || 'icons/stacks/default.svg',
    };

    const currentTechnologies = this.technologies();
    this.technologies.set([...currentTechnologies, newTechnology]);

    return of(newTechnology);
  }

  updateTechnology(id: string, technology: Partial<{ label: string; icon: string }>): Observable<ProjectTechnology> {
    const currentTechnologies = this.technologies();
    const index = currentTechnologies.findIndex((t) => t.id === id);

    if (index === -1) {
      return of({ id, label: id, icon: 'icons/stacks/default.svg' });
    }

    const updatedTechnology: ProjectTechnology = {
      ...currentTechnologies[index],
      ...technology,
    };

    const updatedTechnologies = [...currentTechnologies];
    updatedTechnologies[index] = updatedTechnology;
    this.technologies.set(updatedTechnologies);

    return of(updatedTechnology);
  }
}
