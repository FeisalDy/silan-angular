import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileSizePipe } from '../pipes/file-size.pipe';

@Component({
  selector: 'app-file-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FileSizePipe,
  ],
  templateUrl: './file-card.component.html',
})
export class FileCardComponent {
  @Input() file!: File;
  @Output() remove = new EventEmitter<void>();
}
