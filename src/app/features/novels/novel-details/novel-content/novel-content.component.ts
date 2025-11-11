import { CommonModule } from '@angular/common';
import { Component, computed, input, viewChild } from '@angular/core';
import { Volume } from '@/app/features/novels/volume.model';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '@/app/shared/pipes/truncate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novel-content',
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    TruncatePipe,
    RouterLink,
  ],
  templateUrl: './novel-content.component.html',
})
export class NovelContentComponent {
  volumes = input.required<Volume[]>();

  isVirtual = computed(() =>
    this.volumes()
      .map((v) => v.is_virtual)
      .some((isV) => isV)
  );

  accordion = viewChild.required(MatAccordion);
}
