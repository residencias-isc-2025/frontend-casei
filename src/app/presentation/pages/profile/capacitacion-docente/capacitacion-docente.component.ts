import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CapacitacionDocenteData, InstitucionData } from '@interfaces/index';

import {
  AddTeachingTrainingComponent,
  ConfirmationModalComponent,
  UpdateTeachingTrainingComponent,
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
  selector: 'app-capcitacion-docente',
  imports: [
    AddTeachingTrainingComponent,
    UpdateTeachingTrainingComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './capacitacion-docente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CapitacionDocenteComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);
  public institucionesService = inject(InstitucionesService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public capacitacionDocenteList = signal<CapacitacionDocenteData[]>([]);
  public institucionesList = signal<InstitucionData[]>([]);

  public formacionAcademicaSelected = signal<CapacitacionDocenteData | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.institucionesService.loadInstituciones();
    this.institucionesService.getInstituciones().subscribe((lista) => {
      this.institucionesList.set(lista);
    });
    this.loadCapacitacionDocente();
  }

  private loadCapacitacionDocente(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadCapacitacionDocenteFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.capacitacionDocenteList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las capacitaciones docentes.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(capacitacionDocente: CapacitacionDocenteData) {
    this.formacionAcademicaSelected.set(capacitacionDocente);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(capacitacionDocente: CapacitacionDocenteData) {
    this.formacionAcademicaSelected.set(capacitacionDocente);
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

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarCapacitacionDocente(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadCapacitacionDocente();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las capacitaciones docentes.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
