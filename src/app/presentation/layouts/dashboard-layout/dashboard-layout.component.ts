import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { Router, RouterOutlet } from '@angular/router';
import { UsersService, AuthService } from '../../services';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayoutComponent implements OnInit {
  private router = inject(Router);
  public authService = inject(AuthService);
  public usersService = inject(UsersService);

  userRole = signal<string>(this.loadUserRole());

  ngOnInit(): void {
    this.listenToStorageChanges();
  }

  loadUserRole(): string {
    return this.usersService.getUserRole();
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
    localStorage.removeItem('casei_residencias_access_token');
    localStorage.removeItem('casei_residencias_refresh_token');
    localStorage.removeItem('user-role');
    this.userRole.set('user');
    this.router.navigateByUrl('/auth/login');
  }
}
