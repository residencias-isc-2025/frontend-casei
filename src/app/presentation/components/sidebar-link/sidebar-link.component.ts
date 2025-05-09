import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-link',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLinkComponent {
  routerLinkProp = input.required<string>();
  routeNameProp = input.required<string>();
  iconProp = input.required<string>();
}
