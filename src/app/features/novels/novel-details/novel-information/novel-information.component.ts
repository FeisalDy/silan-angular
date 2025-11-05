import { Novel } from '../../novel.model';
import { SafeHtmlPipe } from '@/app/shared/pipes/safe-html.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { computed, input, Component, inject } from '@angular/core';
import { MediaQueryService } from '@/app/shared/services/media-query.service';
@Component({
  selector: 'app-novel-information',
  imports: [SafeHtmlPipe, MatChipsModule],
  templateUrl: './novel-information.component.html',
})
export class NovelInformationComponent {
  novel = input.required<Novel>();
  tags = computed(() => this.novel().tags || []);

  media = inject(MediaQueryService);
}
