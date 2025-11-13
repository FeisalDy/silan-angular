import { Component, effect, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NovelService } from '@/app/features/novels/novel.service';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  debounceTime,
  delay,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ErrorMessageService } from '@/app/shared/services/error-message.service';
import { Novel } from '@/app/features/novels/novel.model';
import { ApiResponse } from '@/app/core/api/api-response.model';
import { TruncatePipe } from '@/app/shared/pipes/truncate.pipe';
import { ConfirmationDialogComponent } from '@/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarHandlerService } from '@/app/shared/services/snackbar-handler.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-novel-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    TruncatePipe,
    MatMenuModule,
  ],
  templateUrl: './novel-table.component.html',
  styleUrl: './novel-table.component.scss',
})
export class NovelTableComponent {
  private readonly EMPTY_RESPONSE: ApiResponse<Novel[]> = {
    success: false,
    message: '',
    data: [],
    meta: { current_page: 1, limit: 10, total: 0, total_pages: 1 },
  };

  novelService = inject(NovelService);
  errorMessageService = inject(ErrorMessageService);
  notification = inject(SnackbarHandlerService);
  reloadSignal = input.required<number>();

  loadingFetchingNovel = signal(true);
  errorFetchingNovel = signal<string | null>(null);
  params = signal({ page: 1, limit: 10 });

  novelListResponse = toSignal(
    combineLatest([
      toObservable(this.params),
      toObservable(this.reloadSignal),
    ]).pipe(
      debounceTime(200),

      tap(() => {
        this.loadingFetchingNovel.set(true);
        this.errorFetchingNovel.set(null);
      }),
      switchMap(([p]) =>
        this.novelService.getNovels(p).pipe(
          finalize(() => this.loadingFetchingNovel.set(false)),
          catchError((err) => {
            const errorMessage = this.errorMessageService.getMessage(err);
            this.errorFetchingNovel.set(errorMessage);
            return of(this.EMPTY_RESPONSE);
          })
        )
      )
    ),
    { initialValue: this.EMPTY_RESPONSE }
  );

  get novels() {
    return this.novelListResponse()?.data;
  }

  get meta() {
    return this.novelListResponse()?.meta;
  }

  changePage(page: number) {
    this.params.update((p) => ({ ...p, page }));
  }
  changeLimit(limit: number) {
    this.params.update((p) => ({ ...p, limit }));
  }

  columnsToDisplay = ['title', 'operation'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  expandedNovel = signal<Novel | null>(null);
  isExpanded(novel: Novel) {
    return this.expandedNovel() === novel;
  }

  toggle(novel: Novel) {
    this.expandedNovel.set(this.isExpanded(novel) ? null : novel);
  }

  confirmationDialog = inject(MatDialog);

  deleteNovel(novel: Novel) {
    const dialogRef = this.confirmationDialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          title: 'Delete Novel',
          message: `Are you sure you want to delete "${novel.title}"? This action cannot be undone.`,
          confirmText: 'Delete',
          cancelText: 'Cancel',
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.performDelete(novel);
      }
    });
  }

  loadingDeletingNovel = signal(false);
  private performDelete(novel: Novel) {
    this.loadingDeletingNovel.set(true);
    this.novelService
      .deleteNovelById(novel.id)
      .pipe(
        tap(() => {
          this.params.update((p) => ({ ...p }));
        }),
        finalize(() => this.loadingDeletingNovel.set(false))
      )
      .subscribe({
        next: () => {
          this.notification.success('Novel deleted successfully!');
        },
        error: (err) => {
          // Let the global error handler handle 401, 403, 404, and 500+ errors
          if (this.notification.shouldHandleGlobally(err)) {
            return;
          }

          // Handle local/business logic errors
          const errorMessage = this.errorMessageService.getMessage(err);
          this.notification.error(err, errorMessage);
        },
      });
  }
}
