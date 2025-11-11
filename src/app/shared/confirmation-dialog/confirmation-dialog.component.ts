import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
