import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '@feat/admin/project/service/project.service';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mt-8 p-5 bg-background rounded-lg shadow-accent-md border border-accent-200 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-text text-xl font-semibold">Gestion des projets</h2>
        <a
          [routerLink]="['/admin/projects/new']"
          class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
        >
          Ajouter un projet
        </a>
      </div>

      @if (projectService.projects().length === 0) {
        <div class="text-center py-8">
          <p class="text-gray-500">Aucun projet trouvé</p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Image</th>
                <th class="py-3 px-4 text-left">Titre</th>
                <th class="py-3 px-4 text-left">Catégorie</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (project of projectService.projects(); track project.id) {
                <tr class="border-t border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-4">
                    @if (project.image) {
                      <img
                        [src]="getImageUrl(project.image)"
                        alt="{{ project.title }}"
                        class="w-12 h-12 object-cover rounded"
                      />
                    } @else {
                      <div class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span class="text-gray-400 text-xs">No image</span>
                      </div>
                    }
                  </td>
                  <td class="py-3 px-4">{{ project.title }}</td>
                  <td class="py-3 px-4">{{ project.category?.label }}</td>
                  <td class="py-3 px-4">
                    <div class="flex space-x-2">
                      <a [routerLink]="['/admin/projects/edit', project.id]" class="text-blue-500 hover:text-blue-700">
                        Modifier
                      </a>
                      <button (click)="deleteProject(project.id)" class="text-red-500 hover:text-red-700">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectManagementComponent implements OnInit {
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
    if (!path) return '';
    return this.fileUrlService.getFileUrl(path);
  }
}
