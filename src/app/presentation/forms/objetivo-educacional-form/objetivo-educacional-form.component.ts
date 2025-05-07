import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Carrera } from '@core/models/carrera.model';
import { ObjetivoEducacionalService } from '@core/services/objetivo-educacional.service';
import { ToastService } from '@core/services/toast.service';
import { ObjetivoEducacional } from '@core/models/objetivo-educacional.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DondeTrabajaService } from '@core/services/donde-trabaja.service';
import { DondeTrabaja } from '@core/models/donde-trabaja.model';
import { PerfilIngresoService } from '@core/services/perfil-ingreso.service';
import { PerfilIngreso } from '@core/models/perfil-ingreso.mode';
import { PerfilEgreso } from '@core/models/perfil-egreso.model';
import { PerfilEgresoService } from '@core/services/perfil-egreso.service';

@Component({
  selector: 'app-objetivo-educacional-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './objetivo-educacional-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjetivoEducacionalFormComponent implements OnInit {
  onCancel = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  carrera = input.required<Carrera>();
  title = input.required<string>();
  deleteProperty = input.required<string>();
  service = input.required<ObjetivoEducacionalService | DondeTrabajaService | PerfilIngresoService | PerfilEgresoService>();

  dataList = signal<ObjetivoEducacional[]>([]);

  showDeleteModal = signal(false);
  propertySelected = signal<ObjetivoEducacional | DondeTrabaja | PerfilIngreso | PerfilEgreso | null>(null);

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadDataList();
  }

  private loadDataList() {
    this.service()
      .obtenerDatosPaginados(1, 100, {})
      .subscribe((res) => {
        const data = res.results.filter((r) => r.carrera === this.carrera().id);
        this.dataList.set(data);
      });
  }

  onShowDeleteModal(item: ObjetivoEducacional | DondeTrabaja | PerfilIngreso | PerfilEgreso) {
    this.propertySelected.set(item);
    this.showDeleteModal.set(true);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValues = this.form.value;

    const data = {
      descripcion: formValues.descripcion ?? '',
      carrera: this.carrera().id,
    };

    this.service()
      .crear(data)
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess(response.mensaje, 'Éxito');
          this.loadDataList();
        },
      });
  }

  onDelete(id: number) {
    this.service()
      .deshabilitar(id)
      .subscribe({
        next: (response) => {
          this.toastService.showSuccess(response.mensaje, 'Éxito');
          this.loadDataList();
          this.showDeleteModal.set(false);
        },
        error: (response) => {
          this.toastService.showError(response.mensaje, 'Malas noticias');
        },
      });
  }
}
