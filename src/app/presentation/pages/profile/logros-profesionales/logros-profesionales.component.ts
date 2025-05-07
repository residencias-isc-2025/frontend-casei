import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { LogroProfesionalFormComponent } from '@presentation/forms/logro-profesional-form/logro-profesional-form.component';
import { LogroProfesional } from '@core/models/logro-profesional.model';
import { LogroProfesionalService } from '@core/services/logro-profesional.service';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-logros-profesionales',
  imports: [
    LogroProfesionalFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './logros-profesionales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogrosProfesionalesComponent implements OnInit {
  toastService = inject(ToastService);
  logroProfesionalService = inject(LogroProfesionalService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  logrosProfesionalesList = signal<LogroProfesional[]>([]);
  logroProfesionalSelected = signal<LogroProfesional | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadLogrosProfesionalesList();
  }

  private loadLogrosProfesionalesList(): void {
    this.logroProfesionalService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.logrosProfesionalesList.set(res.results);
        },
      });
  }

  onShowUpdateModal(logroProfesional: LogroProfesional) {
    this.logroProfesionalSelected.set(logroProfesional);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(logroProfesional: LogroProfesional) {
    this.logroProfesionalSelected.set(logroProfesional);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadLogrosProfesionalesList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadLogrosProfesionalesList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadLogrosProfesionalesList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.logroProfesionalService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadLogrosProfesionalesList();
      },
    });
  }
}
