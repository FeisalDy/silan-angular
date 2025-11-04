import { Component, inject, OnInit, signal } from '@angular/core';
import { NovelService } from '../novel.service';
import { CommonModule } from '@angular/common';
import { NovelCardComponent } from './novel-card/novel-card.component';
import { Novel } from '../novel.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-novel-lists',
  imports: [CommonModule, NovelCardComponent],
  templateUrl: './novel-lists.component.html',
  styleUrl: './novel-lists.component.scss',
})
export class NovelListsComponent {
  novelService = inject(NovelService);
  novels = signal<Novel[]>([]);

  ngOnInit() {
    this.novelService.getNovels().subscribe((novels) => {
      this.novels.set(novels.data);
    });
  }
}
