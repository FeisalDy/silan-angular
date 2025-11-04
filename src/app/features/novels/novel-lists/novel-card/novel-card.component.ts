import { Component, input } from '@angular/core';
import { Novel } from '../../novel.model';
import { TruncatePipe } from '@/app/shared/pipes/truncate.pipe';

@Component({
  selector: 'app-novel-card',
  standalone: true,
  imports: [TruncatePipe],
  templateUrl: './novel-card.component.html',
  styleUrl: './novel-card.component.scss',
})
export class NovelCardComponent {
  novel = input.required<Novel>();
}
