import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CriterioDesempenioService } from '@core/services/criterio-desempenio.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-criterio-desempenio-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './criterio-desempenio-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriterioDesempenioFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  criterioDesempenioService = inject(CriterioDesempenioService);
  atributoEgresoService = inject(AtributoEgresoService);

  title = input<string>('');
  editing = input.required<boolean>();
  criterioDesempenio = input<CriterioDesempenio>();
  atributosEgreso = input.required<AtributoEgreso[]>();

  atributoDescripcion = signal<string>('No ha seleccionado un atributo.');

  form = this.fb.group({
    descripcion: ['', Validators.required],
    atributo_egreso: [-1, Validators.required],
    nivel: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.criterioDesempenio()?.descripcion,
      atributo_egreso: this.criterioDesempenio()?.atributo_egreso,
      nivel: this.criterioDesempenio()?.nivel,
    });

    const descripcion = this.atributoEgresoService.atributoEgresoDescripcion(
      this.criterioDesempenio()!.atributo_egreso,
      this.atributosEgreso()
    );

    this.atributoDescripcion.set(descripcion);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload: Partial<CriterioDesempenio> = {
      descripcion: formValue.descripcion ?? '',
      atributo_egreso: formValue.atributo_egreso ?? 0,
      nivel: formValue.nivel ?? '',
    };

    console.log(payload);

    const action = this.editing()
      ? this.criterioDesempenioService.actualizar(
          this.criterioDesempenio()!.id,
          payload
        )
      : this.criterioDesempenioService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (response) => {
        this.toastService.showError(response.mensaje, 'Malas noticias');
      },
    });
  }

  handleAtributoEgresoChange(event: Event) {
    const select = event.target as HTMLSelectElement;

    const descripcion = this.atributoEgresoService.atributoEgresoDescripcion(
      +select.value,
      this.atributosEgreso()
    );

    this.atributoDescripcion.set(descripcion);
  }
}
