import { inject, Injectable } from '@angular/core';
import {
  HttpEventType,
  HttpUploadProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { filter, map } from 'rxjs';
import { ApiService } from '@/app/core/api/api.service';
import { ApiResponse } from '@/app/core/api/api-response.model';
import { Novel, NovelListRequest } from './novel.model';
import { Volume } from './volume.model';
import { ApiRequest } from '@/app/core/api/api-request.model';

export type UploadEpubEvent =
  | { type: 'progress'; progress: number }
  | { type: 'success'; response: ApiResponse<unknown> };

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  private api = inject(ApiService);

  getNovels(params?: ApiRequest<NovelListRequest>) {
    return this.api.get<Novel[]>('/novels', params);
  }

  getNovelById(id: string) {
    return this.api.get<Novel>(`/novels/${id}`);
  }

  getNovelVolume(novelId: string) {
    return this.api.get<Volume[]>(`/novels/${novelId}/volumes`);
  }

  deleteNovelById(id: string) {
    return this.api.delete<void>(`/novels/${id}`);
  }

  uploadEpub(file: File) {
    const formData = new FormData();
    formData.append('epub_file', file, file.name);

    return this.api.postWithProgress<unknown>('/novels/epub', formData).pipe(
      map((event): UploadEpubEvent | null => {
        if (event.type === HttpEventType.UploadProgress) {
          const { loaded, total = 0 } = event as HttpUploadProgressEvent;
          const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
          return { type: 'progress', progress };
        }

        if (event.type === HttpEventType.Response && event.body) {
          const { body } = event as HttpResponse<ApiResponse<unknown>>;
          return body ? { type: 'success', response: body } : null;
        }

        return null;
      }),
      filter((event): event is UploadEpubEvent => event !== null)
    );
  }
}
