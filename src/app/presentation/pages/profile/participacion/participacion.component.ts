import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ParticipacionResponse } from '@interfaces/index';
import { AddParticipacionComponent, UpdateParticipacionComponent } from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
} from '@presentation/services';

@Component({
  selector: 'app-participacion',
  imports: [AddParticipacionComponent, UpdateParticipacionComponent],
  templateUrl: './participacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParticipacionComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public participacionList = signal<ParticipacionResponse[]>([]);

  public participacionSelected = signal<ParticipacionResponse | null>(null);

  ngOnInit(): void {
    this.loadParticipacionList();
  }

  private loadParticipacionList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadParticipaciones(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.participacionList.set(res.data || []);
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
    const formacion = this.participacionList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.participacionSelected.set(formacion !== undefined ? formacion : null);

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadParticipacionList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadParticipacionList();
    this.showUpdateModal.set(false);
  }
}
