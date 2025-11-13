import { Component, signal } from '@angular/core';
import { UploadEpubComponent } from '@/app/features/novels/novel-manages/upload-epub/upload-epub.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NovelTableComponent } from '@/app/features/novels/novel-manages/novel-table/novel-table.component';
import { MatAnchor } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from "@angular/router";
@Component({
  selector: 'app-novel-manages',
  imports: [
    MatTabsModule,
    UploadEpubComponent,
    NovelTableComponent,
    MatAnchor,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
],
  templateUrl: './novel-manages.component.html',
})
export class NovelManagesComponent {
  searchValue = signal('');
  reloadCounter = signal(0);

  onUploadSuccess() {
    this.reloadCounter.set(Date.now());
  }
}
