import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { InstitucionService } from '@core/services/institucion.service';
import { tap } from 'rxjs';
import { CapacitacionDocenteFormComponent } from '@presentation/forms/capacitacion-docente-form/capacitacion-docente-form.component';
import { CapacitacionDocente } from '@core/models/capacitacion-docente.model';
import { Institucion } from '@core/models/institucion.model';
import { CapacitacionDocenteService } from '@core/services/capacitacion-docente.service';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-capcitacion-docente',
  imports: [
    CapacitacionDocenteFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './capacitacion-docente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CapitacionDocenteComponent implements OnInit {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);
  capacitacionDocenteService = inject(CapacitacionDocenteService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  capacitacionDocenteList = signal<CapacitacionDocente[]>([]);
  institucionesList = signal<Institucion[]>([]);

  capacitacionDocenteSelected = signal<CapacitacionDocente | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.institucionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        pais: '',
        estado: 'activo',
      })
      .pipe(
        tap((res) => {
          this.institucionesList.set(res.results);
        })
      )
      .subscribe();
    this.loadCapacitacionDocente();
  }

  private loadCapacitacionDocente(): void {
    this.capacitacionDocenteService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.capacitacionDocenteList.set(res.results);
        },
      });
  }

  onShowUpdateModal(capacitacionDocente: CapacitacionDocente) {
    this.capacitacionDocenteSelected.set(capacitacionDocente);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(capacitacionDocente: CapacitacionDocente) {
    this.capacitacionDocenteSelected.set(capacitacionDocente);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadCapacitacionDocente();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadCapacitacionDocente();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadCapacitacionDocente();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.capacitacionDocenteService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadCapacitacionDocente();
      },
    });
  }

  nombreInstitucion(id: number) {
    return this.institucionService.obtenerDataInfo(id, this.institucionesList())
      ?.nombre_institucion;
  }
}
