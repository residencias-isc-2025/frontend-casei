import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActividadAprendizaje } from '@core/models/actividad-aprendizaje.model';
import { ActividadAprendizajeService } from '@core/services/actividad-aprendizaje.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ActividadAprendizajeFormComponent } from '@presentation/forms/actividad-aprendizaje-form/actividad-aprendizaje-form.component';

@Component({
  selector: 'app-actividad-aprendizaje-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ActividadAprendizajeFormComponent,
  ],
  templateUrl: './actividad-aprendizaje-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActividadAprendizajePageComponent implements OnInit {
  toastService = inject(ToastService);
  actividadAprendizajeService = inject(ActividadAprendizajeService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  actividadesAprendizaje = signal<ActividadAprendizaje[]>([]);
  actividadAprendizajeSelected = signal<ActividadAprendizaje | null>(null);

  ngOnInit(): void {
    this.cargarActividadesAprendizaje();
  }

  private cargarActividadesAprendizaje(): void {
    this.actividadAprendizajeService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        next: (response) => {
          if (response.count === 0) this.currentPage.set(0);
          this.totalItems.set(response.count);
          this.actividadesAprendizaje.set(response.results);
        },
        error: (err) => {
          this.toastService.showError(err.mensaje!, 'Malas noticias');
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarActividadesAprendizaje();
  }

  onShowUpdateModel(actividad: ActividadAprendizaje) {
    this.actividadAprendizajeSelected.set(actividad);
    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarActividadesAprendizaje();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarActividadesAprendizaje();
  }

  onDeleteBibliografia(bibliografiaId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.actividadAprendizajeService.deshabilitar(bibliografiaId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarActividadesAprendizaje();
      },
    });
  }
}
