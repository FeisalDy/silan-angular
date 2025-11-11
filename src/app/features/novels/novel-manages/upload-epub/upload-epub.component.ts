import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UploaderComponent } from '@/app/shared/uploader/uploader.component';
import { FileRejection } from '@/app/shared/uploader/uploader-validation.service';
import {
  NovelService,
  UploadEpubEvent,
} from '@/app/features/novels/novel.service';

@Component({
  selector: 'app-upload-epub',
  standalone: true,
  imports: [
    CommonModule,
    UploaderComponent,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './upload-epub.component.html',
})
export class UploadEpubComponent {
  novelService = inject(NovelService);
  snackBar = inject(MatSnackBar);

  uploadSuccess = output<void>();

  selectedFile: File | null = null;
  files: File[] = [];
  uploadProgress = 0;
  isUploading = false;

  readonly acceptTypes = ['.epub', 'application/epub+zip'];
  readonly maxUploadSize = 25 * 1024 * 1024; // 25 MB

  onFilesChanged(files: File[]): void {
    this.files = files;
    this.selectedFile = files.length ? files[0] : null;
  }

  onFilesRejected(rejections: FileRejection[]): void {
    if (rejections.length === 0) {
      return;
    }

    const reason = rejections[0].reason;
    let message = 'The selected file could not be uploaded.';

    if (reason === 'type') {
      message = 'Invalid file type. Please select an EPUB file.';
    } else if (reason === 'size') {
      message = `File exceeds the ${this.formatBytes(
        this.maxUploadSize
      )} limit.`;
    } else if (reason === 'count') {
      message = 'Only one file can be uploaded at a time.';
    }

    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.novelService.uploadEpub(this.selectedFile).subscribe({
      next: (event: UploadEpubEvent) => {
        if (event.type === 'progress') {
          this.uploadProgress = event.progress;
        }

        if (event.type === 'success') {
          this.uploadProgress = 100;
          this.snackBar.open('File uploaded successfully!', 'Close', {
            duration: 3000,
          });
          this.isUploading = false;
          this.files = [];
          this.selectedFile = null;
          this.uploadSuccess.emit();
        }
      },
      error: () => {
        this.snackBar.open('Upload failed. Please try again.', 'Close', {
          duration: 3000,
        });
        this.isUploading = false;
      },
    });
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    const formatted = size % 1 === 0 ? size.toFixed(0) : size.toFixed(1);
    return `${formatted} ${units[unitIndex]}`;
  }
}
