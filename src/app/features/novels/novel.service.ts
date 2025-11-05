import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/app/core/api/api.service';
import { Novel } from './novel.model';
import { Volume } from './volume.model';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  private api = inject(ApiService);

  getNovels() {
    return this.api.get<Novel[]>('/novels');
  }

  getNovelById(id: string) {
    return this.api.get<Novel>(`/novels/${id}`);
  }

  getNovelVolume(novelId: string) {
    return this.api.get<Volume[]>(`/novels/${novelId}/volumes`);
  }
}
