import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ToastService } from '@services/index';
import { ConfirmationModalComponent } from '@modals/index';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { InstitucionService } from '@core/services/institucion.service';
import { tap } from 'rxjs';
import { Institucion } from '@core/models/institucion.model';
import { GestionAcademicaFormComponent } from '@presentation/forms/gestion-academica-form/gestion-academica-form.component';
import { GestionAcademicaService } from '@core/services/gestion-academica.service';
import { GestionAcademica } from '@core/models/gestion-academica.model';

@Component({
  selector: 'app-gestion-academica',
  imports: [
    GestionAcademicaFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './gestion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionAcademicaComponent implements OnInit {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);
  gestionAcademicaService = inject(GestionAcademicaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  gestionAcademicaList = signal<GestionAcademica[]>([]);
  institucionesList = signal<Institucion[]>([]);

  gestionAcademicaSelected = signal<GestionAcademica | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.institucionService
      .obtenerInstitucionesPaginadas(1, 100, {
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
    this.loadGestionAcademicaList();
  }

  private loadGestionAcademicaList(): void {
    this.gestionAcademicaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.gestionAcademicaList.set(res.results);
        },
      });
  }

  onShowUpdateModal(gestionAcademica: GestionAcademica) {
    this.gestionAcademicaSelected.set(gestionAcademica);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(gestionAcademica: GestionAcademica) {
    this.gestionAcademicaSelected.set(gestionAcademica);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadGestionAcademicaList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadGestionAcademicaList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadGestionAcademicaList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.gestionAcademicaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadGestionAcademicaList();
      },
    });
  }
}
