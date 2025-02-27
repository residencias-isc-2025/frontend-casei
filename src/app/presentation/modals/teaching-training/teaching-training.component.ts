import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-teaching-training',
  imports: [],
  templateUrl: './teaching-training.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachingTrainingComponent {
  title = input('');
  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  onSaveData() {
    this.toastService.showInfo('En desarrollo', this.title());
    this.onCancel.emit();
  }
}
