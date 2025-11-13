import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from '@/app/features/layout/home/home.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            '@/app/features/novels/novel-lists/novel-lists.component'
          ).then((m) => m.NovelListsComponent),
      },
      {
        path: 'novels/:id',
        loadComponent: () =>
          import(
            '@/app/features/novels/novel-details/novel-details.component'
          ).then((m) => m.NovelDetailsComponent),
      },
      {
        path: 'novels/:id/chapters/:chapterId',
        loadComponent: () =>
          import(
            '@/app/features/novels/novel-details/novel-content/show-chapter/show-chapter.component'
          ).then((m) => m.ShowChapterComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('@/app/features/layout/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    children: [
      {
        path: 'novels',
        loadComponent: () =>
          import(
            '@/app/features/novels/novel-manages/novel-manages.component'
          ).then((m) => m.NovelManagesComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@/app/features/auths/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
