import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/modals/confirmation-modal/confirmation-modal.component';
import { CommonService, ToastService } from '@presentation/services';
import { ObjetivoEspecificoData } from '../../../interfaces/use-cases/objetivo-especifico.response';
import { AddObjetivoEspecifico } from '@presentation/modals/objetivos-especificos/add-premios/add-objetivos-especificos.component';

@Component({
  selector: 'app-objetivos-especificos-page',
  imports: [PaginationComponent, ConfirmationModalComponent, AddObjetivoEspecifico],
  templateUrl: './objetivos-especificos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ObjetivosEspecificosPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public objetivosList = signal<ObjetivoEspecificoData[]>([]);
  public objetivoSelected = signal<ObjetivoEspecificoData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadObjetivosEspecificos();
  }

  private loadObjetivosEspecificos(): void {
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
            this.objetivosList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener los premios.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(objetivo: ObjetivoEspecificoData) {
    this.objetivoSelected.set(objetivo);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(objetivo: ObjetivoEspecificoData) {
    this.objetivoSelected.set(objetivo);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadObjetivosEspecificos();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadObjetivosEspecificos();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadObjetivosEspecificos();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.eliminarObjetivoEspecifico(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadObjetivosEspecificos();
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
