import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'novels/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'novels/:id/chapters/:chapterId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'upload-epub',
    renderMode: RenderMode.Client,
  },
];
