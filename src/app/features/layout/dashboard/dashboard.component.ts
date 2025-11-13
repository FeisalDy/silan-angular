import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
