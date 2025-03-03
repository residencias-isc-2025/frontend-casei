import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ActualizacionDisciplonarResponse,
  InstitucionesResponse,
} from '@interfaces/index';

import {
  AddActualizacionDisciplinarComponent,
  UpdateActualizacionDisciplinarComponent,
} from '@modals/index';

import { ToastService, ProfileService, CommonService } from '@services/index';

@Component({
  selector: 'app-actualizacion-disciplinar',
  imports: [
    AddActualizacionDisciplinarComponent,
    UpdateActualizacionDisciplinarComponent,
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

  public actualizacionDisciplinarList = signal<
    ActualizacionDisciplonarResponse[]
  >([]);
  public institucionesList = signal<InstitucionesResponse[]>([]);

  public actualizacionDisciplinarSelected =
    signal<ActualizacionDisciplonarResponse | null>(null);

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadActualizacionDisciplinarList();
  }

  private loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.loadInstituciones(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.data || []);
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

    this.profileService.loadActualizacionDisciplinar(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
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
