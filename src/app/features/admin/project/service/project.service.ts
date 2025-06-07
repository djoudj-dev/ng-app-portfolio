import { Injectable, inject, signal } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { Project, ProjectCategory, ProjectTechnology } from '@feat/admin/project/interface/project.interface';
import { PROJECT_TECHNOLOGIES } from '@feat/admin/project/data/project-technologies.data';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly httpAdapter = inject(HttpAdapterService);

  projects = signal<Project[]>([]);
  categories = signal<ProjectCategory[]>([]);
  technologies = signal<ProjectTechnology[]>([]);

  getProjects(): Observable<Project[]> {
    return this.httpAdapter.get<ApiResponse<{ projects: Project[]; categories: ProjectCategory[] }>>('/projects').pipe(
      map((response) => {
        // Check if the response has success: false
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message) ? response.message[0] : response.message || 'Failed to fetch projects'
          );
        }
        return response.data || { projects: [], categories: [] };
      }),
      tap((data) => {
        this.projects.set(data.projects ?? []);
        this.categories.set(data.categories ?? []);
        this.getTechnologies().subscribe();
      }),
      map((data) => data.projects),
      catchError((error) => {
        console.error('Error fetching projects:', error);
        return of([]);
      })
    );
  }

  getProject(id: string): Observable<Project> {
    return this.httpAdapter.get<ApiResponse<Project>>(`/projects/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message)
              ? response.message[0]
              : response.message || `Failed to fetch project with id ${id}`
          );
        }
        return response.data as Project;
      }),
      catchError((error) => {
        console.error(`Error fetching project with id ${id}:`, error);
        throw error;
      })
    );
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.httpAdapter.post<ApiResponse<Project>>('/projects', project).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message) ? response.message[0] : response.message || 'Failed to create project'
          );
        }
        return response.data as Project;
      }),
      tap((newProject) => {
        const currentProjects = this.projects();
        this.projects.set([...currentProjects, newProject]);
      }),
      catchError((error) => {
        console.error('Error creating project:', error);
        throw error;
      })
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.httpAdapter.patch<ApiResponse<Project>>(`/projects/${id}`, project).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message)
              ? response.message[0]
              : response.message || `Failed to update project with id ${id}`
          );
        }
        return response.data as Project;
      }),
      tap((updatedProject) => {
        const currentProjects = this.projects();
        const index = currentProjects.findIndex((p) => p.id === id);
        if (index !== -1) {
          const updatedProjects = [...currentProjects];
          updatedProjects[index] = updatedProject;
          this.projects.set(updatedProjects);
        }
      }),
      catchError((error) => {
        console.error(`Error updating project with id ${id}:`, error);
        throw error;
      })
    );
  }

  deleteProject(id: string): Observable<Project> {
    return this.httpAdapter.delete<ApiResponse<Project>>(`/projects/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message)
              ? response.message[0]
              : response.message || `Failed to delete project with id ${id}`
          );
        }
        return response.data as Project;
      }),
      tap(() => {
        const currentProjects = this.projects();
        this.projects.set(currentProjects.filter((p) => p.id !== id));
      }),
      catchError((error) => {
        console.error(`Error deleting project with id ${id}:`, error);
        throw error;
      })
    );
  }

  uploadProjectImage(id: string, file: File): Observable<Project> {
    return this.httpAdapter.patchFile<ApiResponse<Project>>(`/projects/${id}/image`, file).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message)
              ? response.message[0]
              : response.message || `Failed to upload image for project with id ${id}`
          );
        }
        return response.data as Project;
      }),
      catchError((error) => {
        console.error(`Error uploading image for project with id ${id}:`, error);
        throw error;
      })
    );
  }

  getCategories(): Observable<ProjectCategory[]> {
    return this.httpAdapter.get<ApiResponse<ProjectCategory[]>>('/projects/categories').pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message) ? response.message[0] : response.message || 'Failed to fetch categories'
          );
        }
        return response.data || [];
      }),
      tap((categories) => {
        this.categories.set(categories);
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  createCategory(category: { label: string; icon: string }): Observable<ProjectCategory> {
    return this.httpAdapter.post<ApiResponse<ProjectCategory>>('/projects/categories', category).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message) ? response.message[0] : response.message || 'Failed to create category'
          );
        }
        return response.data as ProjectCategory;
      }),
      tap((newCategory) => {
        const currentCategories = this.categories();
        this.categories.set([...currentCategories, newCategory]);
      }),
      catchError((error) => {
        console.error('Error creating category:', error);
        throw error;
      })
    );
  }

  updateCategory(id: string, category: Partial<{ label: string; icon: string }>): Observable<ProjectCategory> {
    return this.httpAdapter.patch<ApiResponse<ProjectCategory>>(`/projects/categories/${id}`, category).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(
            Array.isArray(response.message)
              ? response.message[0]
              : response.message || `Failed to update category with id ${id}`
          );
        }
        return response.data as ProjectCategory;
      }),
      tap((updatedCategory) => {
        const currentCategories = this.categories();
        const index = currentCategories.findIndex((c) => c.id === id);
        if (index !== -1) {
          const updatedCategories = [...currentCategories];
          updatedCategories[index] = updatedCategory;
          this.categories.set(updatedCategories);
        }
      }),
      catchError((error) => {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
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
