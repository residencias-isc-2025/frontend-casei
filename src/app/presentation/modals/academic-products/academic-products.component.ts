import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ToastService, UsersService } from '../../services';

@Component({
  selector: 'app-academic-products',
  imports: [],
  templateUrl: './academic-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademicProductsComponent {
  title = input('');
  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  onSaveData() {
    this.toastService.showInfo('En desarrollo', this.title());
    this.onCancel.emit();
  }
}
