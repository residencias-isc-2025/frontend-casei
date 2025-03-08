import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AportacionData } from '@interfaces/index';
import {
  AddAportacionComponent,
  ConfirmationModalComponent,
  UpdateAportacionComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-aportaciones',
  imports: [
    AddAportacionComponent,
    UpdateAportacionComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './aportaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AportacionesComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public aportacionesList = signal<AportacionData[]>([]);
  public aportacionSelected = signal<AportacionData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadAportacionesList();
  }

  private loadAportacionesList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadAportacionesFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.aportacionesList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener las aportaciones.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(aportacion: AportacionData) {
    this.aportacionSelected.set(aportacion);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(aportacion: AportacionData) {
    this.aportacionSelected.set(aportacion);
    this.showDeleteModal.set(true);
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

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarAportacion(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadAportacionesList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las aportaciones.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
