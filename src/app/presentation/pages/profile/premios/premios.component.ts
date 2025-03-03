import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PremiosResponse } from '@interfaces/index';
import {
  AddPremiosComponent,
  UpdatePremiosComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
} from '@presentation/services';

@Component({
  selector: 'app-premios',
  imports: [AddPremiosComponent, UpdatePremiosComponent],
  templateUrl: './premios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PremiosComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public premiosList = signal<PremiosResponse[]>([]);
  public premioSelected = signal<PremiosResponse | null>(null);

  ngOnInit(): void {
    this.loadPremiosList();
  }

  private loadPremiosList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadPremios(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.premiosList.set(res.data || []);
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
    const formacion = this.premiosList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.premioSelected.set(formacion !== undefined ? formacion : null);

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadPremiosList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadPremiosList();
    this.showUpdateModal.set(false);
  }
}
