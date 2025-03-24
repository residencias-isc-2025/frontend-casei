import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SideMenuComponent } from '@components/side-menu/side-menu.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayoutComponent implements OnInit {
  auth = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);

  userRole = signal<string>(this.loadUserRole());

  ngOnInit(): void {
    this.listenToStorageChanges();
  }

  loadUserRole(): string {
    return this.userService.obtenerRolUsuario();
  }

  listenToStorageChanges(): void {
    const observer = new MutationObserver(() => {
      const newRole = localStorage.getItem('user-role') || 'user';
      this.userRole.set(newRole);
    });

    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }

  handleLogout() {
    this.auth.logout();
    this.userRole.set('user');
    this.router.navigateByUrl('/auth/login');
  }
}
