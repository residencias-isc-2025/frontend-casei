import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ActualizacionDisciplinarResponse,
  InstitucionesResponse,
} from '@interfaces/index';

import {
  AddActualizacionDisciplinarComponent,
  UpdateActualizacionDisciplinarComponent,
} from '@modals/index';

import { ToastService, ProfileService, CommonService } from '@services/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-actualizacion-disciplinar',
  imports: [
    AddActualizacionDisciplinarComponent,
    UpdateActualizacionDisciplinarComponent,
    PaginationComponent,
  ],
  templateUrl: './actualizacion-disciplinar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActualizacionDisciplinarComponent {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public totalItems = signal(0);
  public actualizacionDisciplinarList = signal<
    ActualizacionDisciplinarResponse[]
  >([]);
  public institucionesList = signal<InstitucionesResponse[]>([]);

  public currentPage = signal(1);
  public actualizacionDisciplinarSelected =
    signal<ActualizacionDisciplinarResponse | null>(null);

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadActualizacionDisciplinarList();
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

  private loadActualizacionDisciplinarList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadActualizacionDisciplinar(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.actualizacionDisciplinarList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener la actualización disciplinar.',
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

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadActualizacionDisciplinarList();
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.actualizacionDisciplinarList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.actualizacionDisciplinarSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadActualizacionDisciplinarList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadActualizacionDisciplinarList();
    this.showUpdateModal.set(false);
  }
}
