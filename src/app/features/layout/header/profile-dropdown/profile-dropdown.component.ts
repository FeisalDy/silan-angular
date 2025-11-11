import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@/app/core/auth/auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { authGuard } from '@/app/core/auth/auth.guard';
@Component({
  selector: 'app-profile-dropdown',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './profile-dropdown.component.html',
})
export class ProfileDropdownComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentUser = this.authService.user;

  handleLogout() {
    this.authService.logout();
    const rootSnapshot = this.router.routerState.snapshot.root;

    let currentRoute: ActivatedRouteSnapshot = rootSnapshot;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const isProtected =
      currentRoute.routeConfig?.canActivate?.includes(authGuard);

    if (isProtected) {
      this.router.navigate(['/login']);
    }
  }
}
