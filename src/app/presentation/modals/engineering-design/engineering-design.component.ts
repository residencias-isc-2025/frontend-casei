import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-engineering-design',
  imports: [],
  templateUrl: './engineering-design.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineeringDesignComponent {
  title = input('');
  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  onSaveData() {
    this.toastService.showInfo('En desarrollo', this.title());
    this.onCancel.emit();
  }
}
