import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayoutComponent {
  private router = inject(Router);
  public authService = inject(AuthService);

  handleLogout() {

    localStorage.removeItem('casei_residencias_access_token');
    localStorage.removeItem('casei_residencias_refresh_token');
    this.router.navigateByUrl('/auth/login');
  }
}
