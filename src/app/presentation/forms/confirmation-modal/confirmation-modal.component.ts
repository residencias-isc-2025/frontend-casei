import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  title = input.required();
  message = input.required();

  cancelButtonText = input('Cancelar');
  confirmButtonText = input('Eliminar');

  onConfirm = output();
  onCancel = output();

  confirmAction() {
    this.onConfirm.emit();
  }

  cancelAction() {
    this.onCancel.emit();
  }
}
