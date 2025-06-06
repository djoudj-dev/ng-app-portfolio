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
        path: 'badges',
        loadComponent: () => import('./badge/badge-management.component').then((m) => m.BadgeManagementComponent),
      },
      {
        path: 'projects',
        loadChildren: () => import('./project/project.routes').then((m) => m.PROJECT_ROUTES),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./contact/contact-message-list.component').then((m) => m.ContactMessageListComponent),
      },
    ],
  },
];
