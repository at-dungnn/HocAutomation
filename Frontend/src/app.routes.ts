import { Routes } from '@angular/router';
import { authGuard } from './app/core/guards/auth.guard';
import { adminGuard } from './app/core/guards/admin.guard';

export const appRoutes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./app/pages/public/dashboard/public-dashboard.component').then(
        (m) => m.PublicDashboardComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/pages/auth/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./app/pages/auth/register').then((m) => m.Register)
  },
  // Auth routes (aliases)
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./app/pages/auth/login').then((m) => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./app/pages/auth/register').then((m) => m.Register)
  },

  // Customer routes (protected)
  {
    path: 'dashboard/exams',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/pages/customer/exam-list/customer-exam-list.component').then(
        (m) => m.CustomerExamListComponent
      )
  },
  {
    path: 'dashboard/history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/pages/customer/exam-history/exam-history.component').then(
        (m) => m.ExamHistoryComponent
      )
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/pages/customer/dashboard/customer-dashboard.component').then(
        (m) => m.CustomerDashboardComponent
      )
  },
  {
    path: 'customer-dashboard',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      )
  },
  {
    path: 'exam/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./app/pages/customer/exam-taking/exam-taking.component').then(
        (m) => m.ExamTakingComponent
      )
  },

  // Admin routes (protected + admin only)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./app/pages/admin/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          )
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./app/pages/admin/categories/category-list/category-list.component').then(
            (m) => m.CategoryListComponent
          )
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./app/pages/admin/courses/course-list/course-list.component').then(
            (m) => m.CourseListComponent
          )
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./app/pages/admin/questions/question-list/question-list.component').then(
            (m) => m.QuestionListComponent
          )
      },
      {
        path: 'exams',
        loadComponent: () =>
          import('./app/pages/admin/exams/exam-list/exam-list.component').then(
            (m) => m.ExamListComponent
          )
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./app/pages/admin/articles/article-list/article-list.component').then(
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
