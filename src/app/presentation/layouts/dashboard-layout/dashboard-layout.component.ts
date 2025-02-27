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

  userRole = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserRole();
    this.listenToStorageChanges();
  }

  loadUserRole(): void {
    const role = this.usersService.getUserRole();
    this.userRole.set(role);
  }

  listenToStorageChanges(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'user-role') {
        this.userRole.set(event.newValue);
      }
    });
  }

  handleLogout() {
    localStorage.removeItem('casei_residencias_access_token');
    localStorage.removeItem('casei_residencias_refresh_token');
    localStorage.removeItem('user-role');
    this.userRole.set(null);
    this.router.navigateByUrl('/auth/login');
  }
}
