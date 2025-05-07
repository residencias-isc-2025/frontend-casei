import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Alumno } from '@core/models/alumno.model';
import { Carrera } from '@core/models/carrera.model';
import { AlumnoService } from '@core/services/alumno.service';
import { CarreraService } from '@core/services/carrera.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { AlumnoFormComponent } from '@presentation/forms/alumno-form/alumno-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-alumno-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    AlumnoFormComponent,
  ],
  templateUrl: './alumno-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlumnoPageComponent implements OnInit {
  toastService = inject(ToastService);
  alumnoService = inject(AlumnoService);
  carreraService = inject(CarreraService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  alumnoSelected = signal<Alumno | null>(null);
  alumnosList = signal<Alumno[]>([]);
  carrerasList = signal<Carrera[]>([]);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadCarrerasList();
    this.loadAlumnosList();
  }

  private loadAlumnosList(): void {
    this.alumnoService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.alumnosList.set(res.results);
        },
      });
  }

  private loadCarrerasList() {
    this.carreraService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.carrerasList.set(res.results);

        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay carreras registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  onShowUpdateModal(item: Alumno) {
    this.alumnoSelected.set(item);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(item: Alumno) {
    this.alumnoSelected.set(item);
    this.showDeleteModal.set(true);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadAlumnosList();
  }

  onSaveEmit() {
    this.loadAlumnosList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadAlumnosList();
    this.showUpdateModal.set(false);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.alumnoService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadAlumnosList();
      },
    });
  }

  carreraData(idCarrera: number) {
    return this.carreraService.obtenerDataInfo(idCarrera, this.carrerasList());
  }
}
