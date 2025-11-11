import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NovelService } from '@/app/features/novels/novel.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { Novel } from '@/app/features/novels/novel.model';
import { Volume } from '@/app/features/novels/volume.model';
import { NovelInformationComponent } from '@/app/features/novels/novel-details/novel-information/novel-information.component';
import { NovelContentComponent } from '@/app/features/novels/novel-details/novel-content/novel-content.component';

@Component({
  selector: 'app-novel-details',
  standalone: true,
  templateUrl: './novel-details.component.html',
  imports: [NovelInformationComponent, NovelContentComponent],
})
export class NovelDetailsComponent {
  private route = inject(ActivatedRoute);
  private novelService = inject(NovelService);

  novel = signal<Novel | null>(null);
  volumes = signal<Volume[]>([]);

  constructor() {
    toSignal(
      this.route.params.pipe(
        map((params) => params['id']),
        filter(Boolean),
        tap(() => {
          this.novel.set(null);
          this.volumes.set([]);
        }),
        switchMap((id) =>
          this.novelService.getNovelById(id).pipe(
            tap((res) => {
              this.novel.set(res.data);
            }),
            switchMap((res) =>
              this.novelService.getNovelVolume(res.data.id).pipe(
                tap((volRes) => {
                  this.volumes.set(volRes.data);
                })
              )
            )
          )
        )
      )
    );
  }
}
