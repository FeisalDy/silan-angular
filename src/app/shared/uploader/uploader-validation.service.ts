import { Injectable } from '@angular/core';

export type FileValidationReason = 'type' | 'size' | 'count';

export interface FileRejection {
  file: File;
  reason: FileValidationReason;
}

export interface FileValidationResult {
  accepted: File[];
  rejected: FileRejection[];
}

export interface FileValidationOptions {
  acceptTokens: string[];
  maxFileSize: number | null;
  maxFiles: number;
  currentFileCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class UploaderValidationService {
  normalizeAccept(accept: string | string[] | null | undefined): string[] {
    if (!accept) {
      return [];
    }

    const tokens = Array.isArray(accept) ? accept : accept.split(',');
    return tokens.map((token) => token.trim()).filter(Boolean);
  }

  validateFiles(
    files: File[],
    options: FileValidationOptions
  ): FileValidationResult {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const normalizedMaxFiles =
      options.maxFiles > 0 ? options.maxFiles : Number.POSITIVE_INFINITY;
    let remainingSlots = Math.max(
      normalizedMaxFiles - options.currentFileCount,
      0
    );

    for (const file of files) {
      if (!this.isFileAccepted(file, options.acceptTokens)) {
        rejected.push({ file, reason: 'type' });
        continue;
      }

      if (
        options.maxFileSize &&
        options.maxFileSize > 0 &&
        file.size > options.maxFileSize
      ) {
        rejected.push({ file, reason: 'size' });
        continue;
      }

      if (remainingSlots <= 0) {
        rejected.push({ file, reason: 'count' });
        continue;
      }

      accepted.push(file);
      if (isFinite(remainingSlots)) {
        remainingSlots -= 1;
      }
    }

    return { accepted, rejected };
  }

  private isFileAccepted(file: File, acceptTokens: string[]): boolean {
    if (acceptTokens.length === 0 || acceptTokens.includes('*/*')) {
      return true;
    }

    return acceptTokens.some((token) => this.matchesAcceptType(token, file));
  }

  private matchesAcceptType(type: string, file: File): boolean {
    const normalizedType = type.trim().toLowerCase();
    if (!normalizedType) {
      return false;
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (normalizedType.startsWith('.')) {
      return fileName.endsWith(normalizedType);
    }

    if (normalizedType.endsWith('/*')) {
      const prefix = normalizedType.slice(0, -1);
      return fileType.startsWith(prefix);
    }

    if (fileType) {
      return fileType === normalizedType;
    }

    return false;
  }
}
