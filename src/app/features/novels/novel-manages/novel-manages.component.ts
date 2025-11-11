import { Component, signal } from '@angular/core';
import { UploadEpubComponent } from '@/app/features/novels/novel-manages/upload-epub/upload-epub.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NovelTableComponent } from '@/app/features/novels/novel-manages/novel-table/novel-table.component';

@Component({
  selector: 'app-novel-manages',
  imports: [MatTabsModule, UploadEpubComponent, NovelTableComponent],
  templateUrl: './novel-manages.component.html',
})
export class NovelManagesComponent {
  reloadCounter = signal(0);

  onUploadSuccess() {
    this.reloadCounter.set(Date.now());
  }
}
