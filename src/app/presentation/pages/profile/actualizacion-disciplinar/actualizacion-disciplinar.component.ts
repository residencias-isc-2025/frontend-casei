import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';
import { InstitucionService } from '@core/services/institucion.service';
import { tap } from 'rxjs';
import { Institucion } from '@core/models/institucion.model';
import { ActualizacionDisciplinarFormComponent } from '@presentation/forms/actualizacion-disciplinar-form/actualizacion-disciplinar-form.component';
import { ActualizacionDisciplinar } from '@core/models/actualizacion-disciplinar.model';
import { ActualizacionDisciplinarService } from '@core/services/actualizacion-disciplinar.service';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-actualizacion-disciplinar',
  imports: [
    ActualizacionDisciplinarFormComponent,
    ConfirmationModalComponent,
    PaginationComponent,
  ],
  templateUrl: './actualizacion-disciplinar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActualizacionDisciplinarComponent {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);
  actualizacionDisciplinarService = inject(ActualizacionDisciplinarService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  totalItems = signal(0);
  actualizacionDisciplinarList = signal<ActualizacionDisciplinar[]>([]);
  institucionesList = signal<Institucion[]>([]);

  currentPage = signal(1);
  actualizacionDisciplinarSelected = signal<ActualizacionDisciplinar | null>(
    null
  );

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadActualizacionDisciplinarList();
  }

  private loadInstituciones() {
    this.institucionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        pais: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          this.institucionesList.set(response.results);

          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay instituciones registradas',
              'Malas noticias'
            );
          }
        },
      });
  }

  private loadActualizacionDisciplinarList(): void {
    this.actualizacionDisciplinarService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.actualizacionDisciplinarList.set(res.results);
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadActualizacionDisciplinarList();
  }

  onShowUpdateModal(actualizacionDisciplinar: ActualizacionDisciplinar) {
    this.actualizacionDisciplinarSelected.set(actualizacionDisciplinar);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(actualizacionDisciplinar: ActualizacionDisciplinar) {
    this.actualizacionDisciplinarSelected.set(actualizacionDisciplinar);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.loadActualizacionDisciplinarList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadActualizacionDisciplinarList();
    this.showUpdateModal.set(false);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.actualizacionDisciplinarService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadActualizacionDisciplinarList();
      },
    });
  }

  getInstitucionNombre(idInstitucion: number) {
    return this.institucionService.obtenerDataInfo(
      idInstitucion,
      this.institucionesList()
    )?.nombre_institucion;
  }
}
