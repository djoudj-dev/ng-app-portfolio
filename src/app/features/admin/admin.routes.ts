import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'hero',
        loadComponent: () => import('./hero/hero-admin.component').then((m) => m.HeroAdminComponent),
      },
      {
        path: 'badges',
        loadComponent: () => import('./badge/badge-management.component').then((m) => m.BadgeManagementComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about-admin.component').then((m) => m.AboutAdminComponent),
      },
    ],
  },
];
