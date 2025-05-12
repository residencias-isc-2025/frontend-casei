import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { CriterioDesempenioService } from '@core/services/criterio-desempenio.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { AtributoEgreso } from '../../../core/models/atributo-egreso.model';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CriterioDesempenioFormComponent } from '@presentation/forms/criterio-desempenio-form/criterio-desempenio-form.component';

@Component({
  selector: 'app-criterios-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    CriterioDesempenioFormComponent,
  ],
  templateUrl: './criterios-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CriteriosPageComponent {
  toastService = inject(ToastService);
  criterioDesempenioService = inject(CriterioDesempenioService);
  atributoEgresoService = inject(AtributoEgresoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  criteriosList = signal<CriterioDesempenio[]>([]);
  atributosEgresoList = signal<AtributoEgreso[]>([]);
  criterioSelected = signal<CriterioDesempenio | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.atributoEgresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      next: (res) => {
        this.atributosEgresoList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay atributos de egreso registrados',
            'Advertencia'
          );
        }
      },
    });

    this.loadCriteriosDesempeno();
  }

  private loadCriteriosDesempeno(): void {
    this.criterioDesempenioService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        next: (response) => {
          if (response.count === 0) this.currentPage.set(0);
          this.totalItems.set(response.count);
          this.criteriosList.set(response.results);
        },
      });
  }

  onShowUpdateModal(criterio: CriterioDesempenio) {
    this.criterioSelected.set(criterio);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(criterio: CriterioDesempenio) {
    this.criterioSelected.set(criterio);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.loadCriteriosDesempeno();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadCriteriosDesempeno();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadCriteriosDesempeno();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.criterioDesempenioService.deshabilitar(itemId).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.mensaje, 'Éxito');
        this.loadCriteriosDesempeno();
      },
      error: (err) => {
        this.toastService.showError(err.mensaje, 'Malas noticias...');
      },
    });
  }

  atributoSiglas(idAtributo: number) {
    return this.atributoEgresoService.obtenerDataInfo(
      idAtributo,
      this.atributosEgresoList()
    )?.siglas;
  }
}
