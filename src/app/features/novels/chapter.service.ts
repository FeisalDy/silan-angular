import { ApiService } from '@/app/core/api/api.service';
import { inject, Injectable } from '@angular/core';
import { Chapter } from './chapter.model';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private api = inject(ApiService);

  getChapterById(id: string) {
    return this.api.get<Chapter>(`/chapters/${id}`);
  }
}
