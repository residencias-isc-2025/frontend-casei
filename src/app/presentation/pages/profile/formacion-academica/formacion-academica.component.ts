import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ConfirmationModalComponent } from '@modals/index';

import { PaginationComponent } from '@components/pagination/pagination.component';
import { ToastService } from '@core/services/toast.service';
import { InstitucionService } from '@core/services/institucion.service';
import { FormacionAcademicaService } from '@core/services/formacion-academica.service';
import { FormacionAcademicaFormComponent } from '@presentation/forms/formacion-academica-form/formacion-academica-form.component';
import { FormacionAcademica } from '@core/models/formacion-academica.model';
import { Institucion } from '@core/models/institucion.model';

@Component({
  selector: 'app-formacion-academica',
  imports: [
    FormacionAcademicaFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './formacion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormacionAcademicaComponent implements OnInit {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);
  formacionAcademicaService = inject(FormacionAcademicaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  formacionAcademicaList = signal<FormacionAcademica[]>([]);
  institucionesList = signal<Institucion[]>([]);

  formacionAcademicaSelected = signal<FormacionAcademica | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.institucionService
      .obtenerInstitucionesPaginadas(1, 100, {
        nombre: '',
        pais: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          this.institucionesList.set(response.results);
        },
      });
    this.loadFormacionAcademica();
  }

  private loadFormacionAcademica(): void {
    this.formacionAcademicaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.formacionAcademicaList.set(res.results);
        },
      });
  }

  onShowUpdateModal(formacionAcademica: FormacionAcademica) {
    this.formacionAcademicaSelected.set(formacionAcademica);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(formacionAcademica: FormacionAcademica) {
    this.formacionAcademicaSelected.set(formacionAcademica);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadFormacionAcademica();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadFormacionAcademica();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadFormacionAcademica();
  }

  onDelete(itemId: number) {
    this.formacionAcademicaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadFormacionAcademica();
      },
    });
  }
}
