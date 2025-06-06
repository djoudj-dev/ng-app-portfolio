import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./project-list/project-list.component').then((m) => m.ProjectListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./project-form/project-form.component').then((m) => m.ProjectFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./project-form/project-form.component').then((m) => m.ProjectFormComponent),
  },
  {
    path: 'categories',
    loadComponent: () => import('./category-form/category-form.component').then((m) => m.CategoryFormComponent),
  },
];
