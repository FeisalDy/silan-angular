import { Component, input } from '@angular/core';
import { Novel } from '@/app/features/novels/novel.model';
import { TruncatePipe } from '@/app/shared/pipes/truncate.pipe';
import { SafeHtmlPipe } from '@/app/shared/pipes/safe-html.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { computed } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novel-card',
  standalone: true,
  imports: [TruncatePipe, SafeHtmlPipe, MatChipsModule, RouterLink],
  templateUrl: './novel-card.component.html',
})
export class NovelCardComponent {
  novel = input.required<Novel>();
  tags = computed(() => this.novel()?.tags ?? []);

  onTagClick(event: MouseEvent, tag: any) {
    event.stopPropagation(); // 🔥 prevent bubbling to routerLink
    console.log('Clicked tag:', tag);
  }
}
