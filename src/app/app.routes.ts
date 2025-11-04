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
    path: 'upload-epub',
    loadComponent: () =>
      import('@/app/features/novels/upload-epub/upload-epub.component').then(
        (m) => m.UploadEpubComponent
      ),
  },
];
