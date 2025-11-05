import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/features/novels/novel-lists/novel-lists.component').then(
        (m) => m.NovelListsComponent
      ),
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
      import('@/app/features/novels/upload-epub/upload-epub.component').then(
        (m) => m.UploadEpubComponent
      ),
  },
];
