import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { EstrategiaEvaluacionFormComponent } from '../../forms/estrategia-evaluacion-form/estrategia-evaluacion-form.component';
import { ToastService } from '@core/services/toast.service';
import { EstrategiaEvaluacionService } from '@core/services/estrategia-evaluacion.service';
import { EstrategiaEvaluacion } from '@core/models/estrategia-evaluacion.model';

@Component({
  selector: 'app-estrategia-evaluacion-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    EstrategiaEvaluacionFormComponent,
  ],
  templateUrl: './estrategia-evaluacion-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EstrategiaEvaluacionPageComponent implements OnInit {
  toastService = inject(ToastService);
  estrategiaEvaluacionService = inject(EstrategiaEvaluacionService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  estrategiasEvaluacionList = signal<EstrategiaEvaluacion[]>([]);
  estrategiaEvaluacionSelected = signal<EstrategiaEvaluacion | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadEstrategiaEvaluacionList();
  }

  private loadEstrategiaEvaluacionList(): void {
    this.estrategiaEvaluacionService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.estrategiasEvaluacionList.set(res.results);
        },
      });
  }

  onShowUpdateModal(estrategia: EstrategiaEvaluacion) {
    this.estrategiaEvaluacionSelected.set(estrategia);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(estrategia: EstrategiaEvaluacion) {
    this.estrategiaEvaluacionSelected.set(estrategia);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.loadEstrategiaEvaluacionList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadEstrategiaEvaluacionList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadEstrategiaEvaluacionList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.estrategiaEvaluacionService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadEstrategiaEvaluacionList();
      },
    });
  }
}
