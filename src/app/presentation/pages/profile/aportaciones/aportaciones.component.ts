import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AportacionesResponse } from '@interfaces/index';
import {
  AddAportacionComponent,
  UpdateAportacionComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-aportaciones',
  imports: [
    AddAportacionComponent,
    UpdateAportacionComponent,
    PaginationComponent,
  ],
  templateUrl: './aportaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AportacionesComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public aportacionesList = signal<AportacionesResponse[]>([]);
  public aportacionSelected = signal<AportacionesResponse | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadAportacionesList();
  }

  private loadAportacionesList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadAportaciones(token, this.currentPage()).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.items!);
          this.aportacionesList.set(res.data || []);
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
    const formacion = this.aportacionesList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.aportacionSelected.set(formacion !== undefined ? formacion : null);

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadAportacionesList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadAportacionesList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadAportacionesList();
  }
}
