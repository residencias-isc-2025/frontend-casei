import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PremioData } from '@interfaces/index';
import {
  AddPremiosComponent,
  ConfirmationModalComponent,
  UpdatePremiosComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-premios',
  imports: [
    AddPremiosComponent,
    UpdatePremiosComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './premios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PremiosComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public premiosList = signal<PremioData[]>([]);
  public premioSelected = signal<PremioData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadPremiosList();
  }

  private loadPremiosList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadPremiosFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.premiosList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener los premios.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(premio: PremioData) {
    this.premioSelected.set(premio);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(premio: PremioData) {
    this.premioSelected.set(premio);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadPremiosList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadPremiosList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadPremiosList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarPremio(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadPremiosList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los premios.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
