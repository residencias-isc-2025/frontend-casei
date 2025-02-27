import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-professional-achievements',
  imports: [],
  templateUrl: './professional-achievements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalAchievementsComponent {
  title = input('');
  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  onSaveData() {
    this.toastService.showInfo('En desarrollo', this.title());
    this.onCancel.emit();
  }
}
