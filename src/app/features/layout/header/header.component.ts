import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatToolbarModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
