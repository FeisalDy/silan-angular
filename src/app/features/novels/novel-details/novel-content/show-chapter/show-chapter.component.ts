import { Component, inject } from '@angular/core';
import { ChapterService } from '@/app/features/novels/chapter.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { SafeHtmlPipe } from '@/app/shared/pipes/safe-html.pipe';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-chapter',
  imports: [SafeHtmlPipe, DatePipe, RouterLink, MatButtonModule],
  templateUrl: './show-chapter.component.html',
})
export class ShowChapterComponent {
  chapterService = inject(ChapterService);
  route = inject(ActivatedRoute);

  chapter = toSignal(
    this.route.params.pipe(
      map((params) => params['chapterId']),
      filter(Boolean),
      switchMap((chapterId: string) =>
        this.chapterService
          .getChapterById(chapterId)
          .pipe(map((res) => res.data))
      )
    ),
    { initialValue: null }
  );

  novelId = toSignal(
    this.route.params.pipe(
      map((params) => params['id']),
      filter(Boolean)
    ),
    { initialValue: null }
  );

  get prevChapterLink() {
    const c = this.chapter();
    return c?.previous_chapter_id
      ? ['/novels', this.novelId(), 'chapters', c.previous_chapter_id]
      : null;
  }

  get tocLink() {
    return ['/novels', this.novelId()];
  }

  get nextChapterLink() {
    const c = this.chapter();
    return c?.next_chapter_id
      ? ['/novels', this.novelId(), 'chapters', c.next_chapter_id]
      : null;
  }
}
