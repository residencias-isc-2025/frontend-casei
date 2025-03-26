import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-atributo-egreso-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atributo-egreso-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtributoEgresoFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  atributoEgresoService = inject(AtributoEgresoService);

  title = input('');
  editing = input.required<boolean>();
  atributoEgreso = input<AtributoEgreso>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
    siglas: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.atributoEgreso()?.descripcion,
      siglas: this.atributoEgreso()?.siglas,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<AtributoEgreso> = {
      descripcion: formValue.descripcion ?? '',
      siglas: formValue.siglas ?? '',
    };

    const action = this.editing()
      ? this.atributoEgresoService.actualizar(
          this.atributoEgreso()!.id,
          payload
        )
      : this.atributoEgresoService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
    });
  }
}
