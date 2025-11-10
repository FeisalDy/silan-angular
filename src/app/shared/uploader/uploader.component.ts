import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectDirective } from './file-select.directive';
import { FileCardComponent } from './file-card.component';
import {
  FileRejection,
  UploaderValidationService,
} from './uploader-validation.service';
import { FileSizePipe } from '../pipes/file-size.pipe';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [CommonModule, FileSelectDirective, FileCardComponent, FileSizePipe],
  templateUrl: './uploader.component.html',
})
export class UploaderComponent {
  @Input() files: File[] = [];
  @Input() accept: string | string[] = '';
  @Input() maxFileSize: number | null = null;
  @Input() maxFiles = 1;
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() rejectedFiles = new EventEmitter<FileRejection[]>();

  private validation = inject(UploaderValidationService);

  get acceptAttribute(): string | null {
    const values = this.validation.normalizeAccept(this.accept);
    return values.length ? values.join(',') : null;
  }

  get allowMultiple(): boolean {
    const maxFiles = this.getNormalizedMaxFiles();
    return !Number.isFinite(maxFiles) || maxFiles !== 1;
  }

  get maxFilesLabel(): string {
    const maxFiles = this.getNormalizedMaxFiles();
    return Number.isFinite(maxFiles) ? `${maxFiles}` : 'Unlimited';
  }

  onFileSelect(fileList: FileList): void {
    const acceptTokens = this.validation.normalizeAccept(this.accept);
    const newFiles = Array.from(fileList);
    const { accepted, rejected } = this.validation.validateFiles(newFiles, {
      acceptTokens,
      maxFileSize:
        this.maxFileSize && this.maxFileSize > 0 ? this.maxFileSize : null,
      maxFiles: this.getNormalizedMaxFiles(),
      currentFileCount: this.files.length,
    });

    if (accepted.length > 0) {
      const updatedFiles = [...this.files, ...accepted];
      this.files = updatedFiles;
      this.filesChanged.emit([...updatedFiles]);
    }

    if (rejected.length > 0) {
      this.rejectedFiles.emit(rejected);
    }
  }

  removeFile(index: number): void {
    const updatedFiles = this.files.filter(
      (_, fileIndex) => fileIndex !== index
    );
    this.files = updatedFiles;
    this.filesChanged.emit([...updatedFiles]);
  }

  private getNormalizedMaxFiles(): number {
    if (!this.maxFiles || this.maxFiles <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.floor(this.maxFiles);
  }
}
