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
  UpdateTeachingTrainingComponent,
} from '@modals/index';

import {
  CommonService,
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
  ],
  templateUrl: './capacitacion-docente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CapitacionDocenteComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public capacitacionDocenteList = signal<CapacitacionDocenteData[]>([]);
  public institucionesList = signal<InstitucionData[]>([]);

  public formacionAcademicaSelected = signal<CapacitacionDocenteData | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadCapacitacionDocente();
  }

  private loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.getInstitucionesList(token, 1, 100).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.schools || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las instituciones.',
            'Hubo un problema'
          );
        }
      },
    });
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

  getInstitucion(idInstitucion: number): string {
    const institucion = this.institucionesList().find(
      (institucion) => institucion.id === idInstitucion
    );

    return institucion ? institucion.nombre_institucion : '';
  }

  onShowUpdateModal(capacitacionDocente: CapacitacionDocenteData) {
    this.formacionAcademicaSelected.set(capacitacionDocente);
    this.showUpdateModal.set(true);
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
