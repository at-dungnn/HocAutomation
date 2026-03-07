import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./pages/public/dashboard/public-dashboard.component').then(
        (m) => m.PublicDashboardComponent
      )
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login').then((m) => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register').then((m) => m.Register)
  },

  // Customer routes (protected)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/customer/dashboard/customer-dashboard.component').then(
        (m) => m.CustomerDashboardComponent
      )
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      )
  },

  // Admin routes (protected + admin only)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/categories/category-list/category-list.component').then(
            (m) => m.CategoryListComponent
          )
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./pages/admin/questions/question-list/question-list.component').then(
            (m) => m.QuestionListComponent
          )
      },
      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/admin/exams/exam-list/exam-list.component').then(
            (m) => m.ExamListComponent
          )
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/admin/articles/article-list/article-list.component').then(
            (m) => m.ArticleListComponent
          )
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
