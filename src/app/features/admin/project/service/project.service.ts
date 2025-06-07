import { Injectable, inject, signal } from '@angular/core';
import { HttpAdapterService } from '@core/http/http.adapter';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { Project, ProjectCategory, ProjectTechnology } from '@feat/admin/project/interface/project.interface';
import { PROJECT_TECHNOLOGIES } from '@feat/admin/project/data/project-technologies.data';
import { ApiResponse } from '@core/models/api-response.model';
import { ErrorHandlerService } from '@core/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly httpAdapter = inject(HttpAdapterService);
  private readonly errorHandler = inject(ErrorHandlerService);

  projects = signal<Project[]>([]);
  categories = signal<ProjectCategory[]>([]);
  technologies = signal<ProjectTechnology[]>([]);

  getProjects(): Observable<Project[]> {
    return this.httpAdapter
      .get<
        | ApiResponse<{ projects: Project[]; categories: ProjectCategory[] }>
        | { projects: Project[]; categories: ProjectCategory[] }
      >('/projects')
      .pipe(
        tap((response) => {
          console.log('✅ Réponse API projets brute:', response); // 👈 AJOUTE ICI
        }),
        map((response) => {
          // Check if the response is an ApiResponse or direct data
          if ('success' in response) {
            // It's an ApiResponse
            const apiResponse = response as ApiResponse<{ projects: Project[]; categories: ProjectCategory[] }>;
            if (!apiResponse.success) {
              throw new Error(
                Array.isArray(apiResponse.message)
                  ? apiResponse.message[0]
                  : apiResponse.message || 'Failed to fetch projects'
              );
            }
            return apiResponse.data || { projects: [], categories: [] };
          } else {
            // It's direct data
            return response as { projects: Project[]; categories: ProjectCategory[] };
          }
        }),
        tap((data) => {
          this.projects.set(data.projects ?? []);
          this.categories.set(data.categories ?? []);
          this.getTechnologies().subscribe();
        }),
        map((data) => data.projects),
        catchError((error: Error | HttpErrorResponse) => {
          console.error('❌ CatchError:', error); // 👈 Et ici aussi
          return of([]);
        })
      );
  }

  getProject(id: string): Observable<Project> {
    return this.httpAdapter.get<ApiResponse<Project> | Project>(`/projects/${id}`).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<Project>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || `Failed to fetch project with id ${id}`
            );
          }
          return apiResponse.data as Project;
        } else {
          // It's direct data
          return response as Project;
        }
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error(`Error fetching project with id ${id}:`, errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error(`Error fetching project with id ${id}:`, error.message);
        }
        throw error;
      })
    );
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.httpAdapter.post<ApiResponse<Project> | Project>('/projects', project).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<Project>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || 'Failed to create project'
            );
          }
          return apiResponse.data as Project;
        } else {
          // It's direct data
          return response as Project;
        }
      }),
      tap((newProject) => {
        const currentProjects = this.projects();
        this.projects.set([...currentProjects, newProject]);
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error('Error creating project:', errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error('Error creating project:', error.message);
        }
        throw error;
      })
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.httpAdapter.patch<ApiResponse<Project> | Project>(`/projects/${id}`, project).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<Project>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || `Failed to update project with id ${id}`
            );
          }
          return apiResponse.data as Project;
        } else {
          // It's direct data
          return response as Project;
        }
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
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error(`Error updating project with id ${id}:`, errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error(`Error updating project with id ${id}:`, error.message);
        }
        throw error;
      })
    );
  }

  deleteProject(id: string): Observable<Project> {
    return this.httpAdapter.delete<ApiResponse<Project> | Project>(`/projects/${id}`).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<Project>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || `Failed to delete project with id ${id}`
            );
          }
          return apiResponse.data as Project;
        } else {
          // It's direct data
          return response as Project;
        }
      }),
      tap(() => {
        const currentProjects = this.projects();
        this.projects.set(currentProjects.filter((p) => p.id !== id));
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error(`Error deleting project with id ${id}:`, errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error(`Error deleting project with id ${id}:`, error.message);
        }
        throw error;
      })
    );
  }

  uploadProjectImage(id: string, file: File): Observable<Project> {
    return this.httpAdapter.patchFile<ApiResponse<Project> | Project>(`/projects/${id}/image`, file).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<Project>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || `Failed to upload image for project with id ${id}`
            );
          }
          return apiResponse.data as Project;
        } else {
          // It's direct data
          return response as Project;
        }
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error(`Error uploading image for project with id ${id}:`, errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error(`Error uploading image for project with id ${id}:`, error.message);
        }
        throw error;
      })
    );
  }

  getCategories(): Observable<ProjectCategory[]> {
    return this.httpAdapter.get<ApiResponse<ProjectCategory[]> | ProjectCategory[]>('/projects/categories').pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<ProjectCategory[]>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || 'Failed to fetch categories'
            );
          }
          return apiResponse.data || [];
        } else {
          // It's direct data
          return response as ProjectCategory[];
        }
      }),
      tap((categories) => {
        this.categories.set(categories);
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error('Error fetching categories:', errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error('Error fetching categories:', error.message);
        }
        return of([]);
      })
    );
  }

  createCategory(category: { label: string; icon: string }): Observable<ProjectCategory> {
    return this.httpAdapter.post<ApiResponse<ProjectCategory> | ProjectCategory>('/projects/categories', category).pipe(
      map((response) => {
        // Check if the response is an ApiResponse or direct data
        if ('success' in response) {
          // It's an ApiResponse
          const apiResponse = response as ApiResponse<ProjectCategory>;
          if (!apiResponse.success) {
            throw new Error(
              Array.isArray(apiResponse.message)
                ? apiResponse.message[0]
                : apiResponse.message || 'Failed to create category'
            );
          }
          return apiResponse.data as ProjectCategory;
        } else {
          // It's direct data
          return response as ProjectCategory;
        }
      }),
      tap((newCategory) => {
        const currentCategories = this.categories();
        this.categories.set([...currentCategories, newCategory]);
      }),
      catchError((error: Error | HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors (network errors, server errors, etc.)
          const errorMessage = this.errorHandler.handleApiError(error);
          console.error('Error creating category:', errorMessage);
        } else {
          // Handle other errors (like the one thrown in the map operator above)
          console.error('Error creating category:', error.message);
        }
        throw error;
      })
    );
  }

  updateCategory(id: string, category: Partial<{ label: string; icon: string }>): Observable<ProjectCategory> {
    return this.httpAdapter
      .patch<ApiResponse<ProjectCategory> | ProjectCategory>(`/projects/categories/${id}`, category)
      .pipe(
        map((response) => {
          // Check if the response is an ApiResponse or direct data
          if ('success' in response) {
            // It's an ApiResponse
            const apiResponse = response as ApiResponse<ProjectCategory>;
            if (!apiResponse.success) {
              throw new Error(
                Array.isArray(apiResponse.message)
                  ? apiResponse.message[0]
                  : apiResponse.message || `Failed to update category with id ${id}`
              );
            }
            return apiResponse.data as ProjectCategory;
          } else {
            // It's direct data
            return response as ProjectCategory;
          }
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
        catchError((error: Error | HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse) {
            // Handle HTTP errors (network errors, server errors, etc.)
            const errorMessage = this.errorHandler.handleApiError(error);
            console.error(`Error updating category with id ${id}:`, errorMessage);
          } else {
            // Handle other errors (like the one thrown in the map operator above)
            console.error(`Error updating category with id ${id}:`, error.message);
          }
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
