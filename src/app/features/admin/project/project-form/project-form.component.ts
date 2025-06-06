import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { Project, ProjectRepo } from '../interface/project.interface';
import { switchMap, of, tap, catchError } from 'rxjs';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { FileUrlService } from '@core/services/file-url.service';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6">{{ isEditMode() ? 'Modifier' : 'Ajouter' }} un projet</h1>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <!-- Titre -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (projectForm.get('title')?.invalid && projectForm.get('title')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le titre est requis</p>
            }
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            @if (projectForm.get('description')?.invalid && projectForm.get('description')?.touched) {
              <p class="mt-1 text-sm text-red-600">La description est requise</p>
            }
          </div>

          <!-- Catégorie -->
          <div class="mb-4">
            <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              id="categoryId"
              formControlName="categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              @for (category of projectService.categories(); track category.id) {
                <option [value]="category.id">{{ category.label }}</option>
              }
            </select>
            @if (projectForm.get('categoryId')?.invalid && projectForm.get('categoryId')?.touched) {
              <p class="mt-1 text-sm text-red-600">La catégorie est requise</p>
            }
          </div>

          <!-- URL de déploiement -->
          <div class="mb-4">
            <label for="deployUrl" class="block text-sm font-medium text-gray-700 mb-1">URL de déploiement</label>
            <input
              type="url"
              id="deployUrl"
              formControlName="deployUrl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Icône de déploiement -->
          <div class="mb-4">
            <label for="iconDeploy" class="block text-sm font-medium text-gray-700 mb-1">Icône de déploiement</label>
            <input
              type="text"
              id="iconDeploy"
              formControlName="iconDeploy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (projectForm.get('iconDeploy')?.invalid && projectForm.get('iconDeploy')?.touched) {
              <p class="mt-1 text-sm text-red-600">L'icône de déploiement est requise</p>
            }
          </div>

          <!-- Technologies -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
            <div formArrayName="technologies">
              @for (tech of technologiesFormArray.controls; track tech) {
                <div class="flex items-center mb-2">
                  <select
                    [formControlName]="$index"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une technologie</option>
                    @for (technology of projectService.technologies(); track technology.id) {
                      <option [value]="technology.id">{{ technology.label }}</option>
                    }
                  </select>
                  <button type="button" (click)="removeTechnology($index)" class="ml-2 text-red-500 hover:text-red-700">
                    Supprimer
                  </button>
                </div>
              }
              <button
                type="button"
                (click)="addTechnology()"
                class="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              >
                Ajouter une technologie
              </button>
            </div>
          </div>

          <!-- Priorité -->
          <div class="mb-4">
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
            <input
              type="number"
              id="priority"
              formControlName="priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (projectForm.get('priority')?.invalid && projectForm.get('priority')?.touched) {
              <p class="mt-1 text-sm text-red-600">La priorité est requise</p>
            }
          </div>

          <!-- Dépôts -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dépôts</label>
            <div formArrayName="repos">
              @for (repo of reposFormArray.controls; track repo) {
                <div [formGroupName]="$index" class="p-3 border border-gray-200 rounded-md mb-2">
                  <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      formControlName="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      formControlName="label"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Icône</label>
                    <input
                      type="text"
                      formControlName="icon"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    (click)="removeRepo($index)"
                    class="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer ce dépôt
                  </button>
                </div>
              }
              <button
                type="button"
                (click)="addRepo()"
                class="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
              >
                Ajouter un dépôt
              </button>
            </div>
          </div>

          <!-- Image -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <app-image-upload
              [uploadedImage]="currentImage()"
              (fileSelected)="onImageSelected($event)"
              (fileRemoved)="onImageRemoved()"
              hint="JPG, PNG, GIF, WEBP (max 5MB)"
            ></app-image-upload>
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-3">
            <button type="button" (click)="goBack()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="projectForm.invalid || isSubmitting()"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-blue-300"
            >
              {{ isSubmitting() ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  projectService = inject(ProjectService);
  private readonly fileUrlService = inject(FileUrlService);

  projectForm!: FormGroup;
  projectId: string | null = null;
  isEditMode = signal(false);
  isSubmitting = signal(false);
  currentImage = signal<string | null>(null);
  selectedFile: File | null = null;

  get technologiesFormArray(): FormArray {
    return this.projectForm.get('technologies') as FormArray;
  }

  get reposFormArray(): FormArray {
    return this.projectForm.get('repos') as FormArray;
  }

  ngOnInit(): void {
    this.initForm();

    // Charger les projets, catégories et technologies en une seule fois
    this.projectService.getProjects().subscribe({
      next: () => {
        console.log('Projects, categories and technologies loaded in component');
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.projectId = id;
          this.isEditMode.set(!!id && id !== 'new');

          if (this.isEditMode()) {
            return this.projectService.getProject(id!);
          }

          return of(null);
        })
      )
      .subscribe((project) => {
        if (project) {
          this.updateForm(project);
          if (project.image) {
            this.currentImage.set(this.fileUrlService.getFileUrl(project.image));
          }
        }
      });
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      deployUrl: [''],
      iconDeploy: ['', Validators.required],
      technologies: this.fb.array([]),
      priority: [0, Validators.required],
      repos: this.fb.array([]),
    });
  }

  updateForm(project: Project): void {
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      categoryId: project.categoryId,
      deployUrl: project.deployUrl,
      iconDeploy: project.iconDeploy,
      priority: project.priority,
    });

    // Clear and rebuild technologies array
    while (this.technologiesFormArray.length) {
      this.technologiesFormArray.removeAt(0);
    }

    project.technologies.forEach((tech: string) => {
      this.technologiesFormArray.push(this.fb.control(tech));
    });

    // Clear and rebuild repos array
    while (this.reposFormArray.length) {
      this.reposFormArray.removeAt(0);
    }

    project.repos.forEach((repo: ProjectRepo) => {
      this.reposFormArray.push(
        this.fb.group({
          url: [repo.url, Validators.required],
          label: [repo.label, Validators.required],
          icon: [repo.icon, Validators.required],
        })
      );
    });
  }

  addTechnology(): void {
    this.technologiesFormArray.push(this.fb.control(''));
  }

  removeTechnology(index: number): void {
    this.technologiesFormArray.removeAt(index);
  }

  addRepo(): void {
    this.reposFormArray.push(
      this.fb.group({
        url: ['', Validators.required],
        label: ['', Validators.required],
        icon: ['', Validators.required],
      })
    );
  }

  removeRepo(index: number): void {
    this.reposFormArray.removeAt(index);
  }

  onImageSelected(file: File): void {
    this.selectedFile = file;
    // No need to set currentImage as the ImageUploadComponent handles the preview
  }

  onImageRemoved(): void {
    this.selectedFile = null;
    this.currentImage.set(null);
  }

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.projectForm.value;

    const saveProject = () => {
      if (this.isEditMode()) {
        return this.projectService.updateProject(this.projectId!, formData);
      } else {
        return this.projectService.createProject(formData);
      }
    };

    const uploadImage = (project: Project) => {
      if (this.selectedFile) {
        return this.projectService.uploadProjectImage(project.id, this.selectedFile);
      }
      return of(project);
    };

    saveProject()
      .pipe(
        switchMap((project) => uploadImage(project)),
        tap(() => {
          this.router.navigate(['/admin/projects']);
        }),
        catchError((error) => {
          console.error(error);
          this.isSubmitting.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  goBack(): void {
    this.router.navigate(['/admin/projects']);
  }
}
