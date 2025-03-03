import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LogrosPrefesionalesResponse } from '@interfaces/index';
import {
  AddLogroProfesionalComponent,
  UpdateLogroProfesionalComponent,
} from '@presentation/modals';
import {
  CommonService,
  ProfileService,
  ToastService,
} from '@presentation/services';

@Component({
  selector: 'app-logros-profesionales',
  imports: [AddLogroProfesionalComponent, UpdateLogroProfesionalComponent],
  templateUrl: './logros-profesionales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogrosProfesionalesComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public logrosProfesionalesList = signal<LogrosPrefesionalesResponse[]>([]);
  public logroProfesionalSelected = signal<LogrosPrefesionalesResponse | null>(
    null
  );

  ngOnInit(): void {
    this.loadLogrosProfesionalesList();
  }

  private loadLogrosProfesionalesList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadLogrosProfesionales(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.logrosProfesionalesList.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la actualización disciplinar.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.logrosProfesionalesList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.logroProfesionalSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadLogrosProfesionalesList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadLogrosProfesionalesList();
    this.showUpdateModal.set(false);
  }
}
