import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-user',
  imports: [],
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  public toastService = inject(ToastService);

  onCancel = output();

  onCreateUser() {
    this.toastService.showSuccess('', 'Usuario creado');
    this.onCancel.emit();
  }
}
