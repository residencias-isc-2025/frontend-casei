import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";

@Component({
  selector: 'app-dashboard-layout',
  imports: [SideMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardLayoutComponent { }
