import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../service/project.service';
import { ProjectCategory } from '../interface/project.interface';
import { switchMap, of, tap, catchError } from 'rxjs';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6">{{ isEditMode() ? 'Modifier' : 'Ajouter' }} une catégorie</h1>

        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
          <!-- Label -->
          <div class="mb-4">
            <label for="label" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="label"
              formControlName="label"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (categoryForm.get('label')?.invalid && categoryForm.get('label')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
            }
          </div>

          <!-- Icon -->
          <div class="mb-6">
            <label for="icon" class="block text-sm font-medium text-gray-700 mb-1">Icône</label>
            <input
              type="text"
              id="icon"
              formControlName="icon"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (categoryForm.get('icon')?.invalid && categoryForm.get('icon')?.touched) {
              <p class="mt-1 text-sm text-red-600">L'icône est requise</p>
            }
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-3">
            <button type="button" (click)="goBack()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="categoryForm.invalid || isSubmitting()"
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
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  projectService = inject(ProjectService);

  categoryForm!: FormGroup;
  categoryId: string | null = null;
  isEditMode = signal(false);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.categoryId = id;
          this.isEditMode.set(!!id && id !== 'new');

          if (this.isEditMode()) {
            return this.projectService.getCategories().pipe(
              switchMap(() => {
                const categories = this.projectService.categories();
                const category = categories.find((c) => c.id === id);
                return of(category);
              })
            );
          }

          return of(null);
        })
      )
      .subscribe((category) => {
        if (category) {
          this.updateForm(category);
        }
      });
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      label: ['', Validators.required],
      icon: ['', Validators.required],
    });
  }

  updateForm(category: ProjectCategory): void {
    this.categoryForm.patchValue({
      label: category.label,
      icon: category.icon,
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.categoryForm.value;

    const saveCategory = () => {
      if (this.isEditMode()) {
        return this.projectService.updateCategory(this.categoryId!, formData);
      } else {
        return this.projectService.createCategory(formData);
      }
    };

    saveCategory()
      .pipe(
        tap(() => {
          this.router.navigate(['/admin/projects/categories']);
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
    this.router.navigate(['/admin/projects/categories']);
  }
}
