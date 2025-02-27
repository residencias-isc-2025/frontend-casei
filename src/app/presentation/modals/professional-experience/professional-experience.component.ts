import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-professional-experience',
  imports: [],
  templateUrl: './professional-experience.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalExperienceComponent {
  title = input('');
  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  onSaveData() {
    this.toastService.showInfo('En desarrollo', this.title());
    this.onCancel.emit();
  }
}
