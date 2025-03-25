import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { Premio } from '@core/models/premio.model';
import { PremioService } from '@core/services/premio.service';
import { PremioFormComponent } from '@presentation/forms/premio-form/premio-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-premios',
  imports: [
    PremioFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './premios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PremiosComponent implements OnInit {
  toastService = inject(ToastService);
  premioService = inject(PremioService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  premiosList = signal<Premio[]>([]);
  premioSelected = signal<Premio | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadPremiosList();
  }

  private loadPremiosList(): void {
    this.premioService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.premiosList.set(res.results);
        },
      });
  }

  onShowUpdateModal(premio: Premio) {
    this.premioSelected.set(premio);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(premio: Premio) {
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

    this.premioService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showError(res.mensaje!, 'Éxito');
        this.loadPremiosList();
      },
    });
  }
}
