import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';
import { DisenoIngenierilFormComponent } from '@presentation/forms/diseno-ingenieril-form/diseno-ingenieril-form.component';
import { DisenoIngenieril } from '@core/models/diseno-ingenieril.model';
import { DisenoIngenierilService } from '@core/services/diseno-ingenieril.service';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-diseno-ingenieril',
  imports: [
    DisenoIngenierilFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './diseno-ingenieril.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DisenoIngenierilComponent implements OnInit {
  toastService = inject(ToastService);
  disenoIngenierilService = inject(DisenoIngenierilService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  disenoIngenierilList = signal<DisenoIngenieril[]>([]);

  disenoIngenierilSelected = signal<DisenoIngenieril | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadDisenoIngenierilList();
  }

  private loadDisenoIngenierilList(): void {
    this.disenoIngenierilService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.disenoIngenierilList.set(res.results);
        },
      });
  }

  onShowUpdateModal(disenoIngenieril: DisenoIngenieril) {
    this.disenoIngenierilSelected.set(disenoIngenieril);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(disenoIngenieril: DisenoIngenieril) {
    this.disenoIngenierilSelected.set(disenoIngenieril);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadDisenoIngenierilList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadDisenoIngenierilList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadDisenoIngenierilList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.disenoIngenierilService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadDisenoIngenierilList();
      },
    });
  }
}
