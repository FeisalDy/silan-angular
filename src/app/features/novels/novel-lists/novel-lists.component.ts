import { Component, inject } from '@angular/core';
import { NovelService } from '@/app/features/novels/novel.service';
import { CommonModule } from '@angular/common';
import { NovelCardComponent } from '@/app/features/novels/novel-lists/novel-card/novel-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-novel-lists',
  standalone: true,
  imports: [CommonModule, NovelCardComponent],
  templateUrl: './novel-lists.component.html',
})
export class NovelListsComponent {
  private novelService = inject(NovelService);

  novels = toSignal(
    this.novelService.getNovels().pipe(map((res) => res.data)),
    { initialValue: [] }
  );
}
