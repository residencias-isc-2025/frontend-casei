import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ParticipacionData } from '@interfaces/index';
import {
  AddParticipacionComponent,
  ConfirmationModalComponent,
  UpdateParticipacionComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { CommonService } from '@core/services/common.service';

@Component({
  selector: 'app-participacion',
  imports: [
    AddParticipacionComponent,
    UpdateParticipacionComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './participacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParticipacionComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public participacionList = signal<ParticipacionData[]>([]);
  public participacionSelected = signal<ParticipacionData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadParticipacionList();
  }

  private loadParticipacionList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadParticipacionesFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.participacionList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener las participaciones.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(participacion: ParticipacionData) {
    this.participacionSelected.set(participacion);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(participacion: ParticipacionData) {
    this.participacionSelected.set(participacion);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadParticipacionList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadParticipacionList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadParticipacionList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarParticipacion(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadParticipacionList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las participaciones.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
