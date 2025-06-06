import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { FileUrlService } from '@core/services/file-url.service';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-text">Gestion des projets</h1>
        <app-button
          [routerLink]="['/admin/projects/new']"
          color="accent"
          [customClass]="'px-4 sm:px-6 py-2 sm:py-3 shadow-md hover:shadow-lg transition-all duration-200'"
        >
          Ajouter un projet
        </app-button>
      </div>

      @if (projectService.projects().length === 0) {
        <div class="text-center py-8">
          <p class="text-gray-500">Aucun projet trouvé</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-background border border-gray-400 rounded-xl">
            <thead class="bg-background">
              <tr>
                <th class="py-3 px-4 text-left text-text">Image</th>
                <th class="py-3 px-4 text-left text-text">Titre</th>
                <th class="py-3 px-4 text-left text-text">Catégorie</th>
                <th class="py-3 px-4 text-left text-text">Priorité</th>
                <th class="py-3 px-4 text-left text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (project of projectService.projects(); track project.id) {
                <tr class="border-t border-gray-200 hover:bg-gray-400">
                  <td class="py-3 px-4">
                    @if (project.image) {
                      <img
                        [src]="getImageUrl(project.image)"
                        alt="{{ project.title }}"
                        class="w-16 h-16 object-cover rounded"
                      />
                    } @else {
                      <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span class="text-gray-400">No image</span>
                      </div>
                    }
                  </td>
                  <td class="py-3 px-4">{{ project.title }}</td>
                  <td class="py-3 px-4">{{ project.category?.label }}</td>
                  <td class="py-3 px-4">{{ project.priority }}</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <a [routerLink]="['/admin/projects/edit', project.id]" class="text-accent hover:text-accent-700">
                        Modifier
                      </a>
                      <button (click)="deleteProject(project.id)" class="text-primary hover:text-primary-700">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ProjectListComponent implements OnInit {
  projectService = inject(ProjectService);
  private readonly fileUrlService = inject(FileUrlService);

  ngOnInit(): void {
    this.projectService.getProjects().subscribe();
    this.projectService.getCategories().subscribe();
  }

  deleteProject(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(id).subscribe();
    }
  }

  getImageUrl(path: string): string {
    return this.fileUrlService.getFileUrl(path);
  }
}
