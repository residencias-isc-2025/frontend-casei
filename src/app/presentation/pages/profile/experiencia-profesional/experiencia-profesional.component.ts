import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ExperienciaProfesionalResponse } from '@interfaces/index';
import {
  AddExperienciaProfesionalComponent,
  UpdateExperienciaProfesionalComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
} from '@presentation/services';

@Component({
  selector: 'app-experiencia-profesional',
  imports: [
    AddExperienciaProfesionalComponent,
    UpdateExperienciaProfesionalComponent,
  ],
  templateUrl: './experiencia-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienciaProfesionalComponent {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public experienciaProfesionalList = signal<ExperienciaProfesionalResponse[]>(
    []
  );

  public experienciaProfesionalSelected =
    signal<ExperienciaProfesionalResponse | null>(null);

  ngOnInit(): void {
    this.loadExperienciaProfesionalList();
  }

  private loadExperienciaProfesionalList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadExperienciaProfesional(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.experienciaProfesionalList.set(res.data || []);
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
    const formacion = this.experienciaProfesionalList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.experienciaProfesionalSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadExperienciaProfesionalList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadExperienciaProfesionalList();
    this.showUpdateModal.set(false);
  }
}
