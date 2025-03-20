import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/modals/confirmation-modal/confirmation-modal.component';
import { ToastService, CommonService } from '@presentation/services';

@Component({
  selector: 'app-criterios-page',
  imports: [PaginationComponent, ConfirmationModalComponent],
  templateUrl: './criterios-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CriteriosPageComponent {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public criteriosList = signal<any[]>([]);
  public criterioSelected = signal<any | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    //this.loadCriteriosDesempeno();
  }

  private loadCriteriosDesempeno(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .getObjetivosEspecificosList({
        accessToken: token,
        page: this.currentPage(),
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.criteriosList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener los premios.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(criterio: any) {
    this.criterioSelected.set(criterio);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(criterio: any) {
    this.criterioSelected.set(criterio);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    //this.loadCriteriosDesempeno();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    //this.loadCriteriosDesempeno();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    //this.loadCriteriosDesempeno();
  }

  onDelete(itemId: number) {
    return;

    this.showDeleteModal.set(false);
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.eliminarObjetivoEspecifico(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          //this.loadCriteriosDesempeno();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los objetivos específicos.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
