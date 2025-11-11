import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';
import { AuthService } from '@/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatToolbarModule,
    ProfileDropdownComponent,
    RouterLink,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get canUploadNovel() {
    return this.authService.hasPermission('novel', 'create');
  }

  getCurrentUrl(): string {
    const currentUrl = this.router.url;
    const urlTree = this.router.parseUrl(currentUrl);

    if (urlTree.queryParams['returnUrl']) {
      delete urlTree.queryParams['returnUrl'];
    }

    const cleanUrl = this.router.serializeUrl(urlTree);

    return encodeURIComponent(cleanUrl);
  }
}
