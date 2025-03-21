import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormacionAcademicaData, InstitucionData } from '@interfaces/index';

import {
  AddAcademicTrainingComponent,
  ConfirmationModalComponent,
  UpdateAcademicTrainingComponent,
} from '@modals/index';

import {
  CommonService,
  InstitucionesService,
  ProfileService,
  ToastService,
  UsersService,
} from '@services/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-formacion-academica',
  imports: [
    AddAcademicTrainingComponent,
    UpdateAcademicTrainingComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './formacion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormacionAcademicaComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);
  public institucionesService = inject(InstitucionesService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public formacionAcademicaList = signal<FormacionAcademicaData[]>([]);
  public institucionesList = signal<InstitucionData[]>([]);

  public formacionAcademicaSelected = signal<FormacionAcademicaData | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.institucionesService.loadInstituciones();
    this.institucionesService.getInstituciones().subscribe((lista) => {
      this.institucionesList.set(lista);
    });
    this.loadFormacionAcademica();
  }

  private loadFormacionAcademica(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadFormacionAcademicaFunction(token, this.currentPage())
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
              'No se pudieron obtener las formaciones académicas.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(formacionAcademica: FormacionAcademicaData) {
    this.formacionAcademicaSelected.set(formacionAcademica);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(formacionAcademica: FormacionAcademicaData) {
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
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarFormacionAcademica(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadFormacionAcademica();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las formaciones académicas.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
