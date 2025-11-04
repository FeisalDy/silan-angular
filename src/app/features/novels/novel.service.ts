import { inject, Injectable } from '@angular/core';
import { ApiService } from '@/app/core/api/api.service';
import { Novel } from './novel.model';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  private api = inject(ApiService);

  getNovels() {
    return this.api.get<Novel[]>('/novels');
  }
}
