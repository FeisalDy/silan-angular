import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
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
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/novels',
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard/novels/create',
    renderMode: RenderMode.Client,
  },
];
