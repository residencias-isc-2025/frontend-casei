import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormacionAcademicaResponse,
  InstitucionesResponse,
} from '@interfaces/index';

import {
  AddAcademicTrainingComponent,
  UpdateAcademicTrainingComponent,
} from '@modals/index';

import { CommonService, ProfileService, ToastService } from '@services/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-formacion-academica',
  imports: [
    AddAcademicTrainingComponent,
    UpdateAcademicTrainingComponent,
    PaginationComponent,
  ],
  templateUrl: './formacion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormacionAcademicaComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public formacionAcademicaList = signal<FormacionAcademicaResponse[]>([]);
  public institucionesList = signal<InstitucionesResponse[]>([]);

  public formacionAcademicaSelected = signal<FormacionAcademicaResponse | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadFormacionAcademica();
  }

  private loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.loadInstituciones(token, 1, 100).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.schools || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la formación académica.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  private loadFormacionAcademica(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadFormacionAcademica(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.formacionAcademicaList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener la formación académica.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  getInstitucion(idInstitucion: number): string {
    const institucion = this.institucionesList().find(
      (institucion) => institucion.id === idInstitucion
    );

    return institucion ? institucion.nombre_institucion : '';
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.formacionAcademicaList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.formacionAcademicaSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
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
}
