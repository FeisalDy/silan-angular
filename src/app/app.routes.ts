import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/features/novels/novel-lists/novel-lists.component').then(
        (m) => m.NovelListsComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@/app/features/auths/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'novels/manages',
    loadComponent: () =>
      import(
        '@/app/features/novels/novel-manages/novel-manages.component'
      ).then((m) => m.NovelManagesComponent),
    canActivate: [authGuard],
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
  {
    path: 'upload-epub',
    loadComponent: () =>
      import(
        '@/app/features/novels/novel-manages/upload-epub/upload-epub.component'
      ).then((m) => m.UploadEpubComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@/app/features/auths/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
