import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Practica } from '@core/models/practica.model';
import { PracticaService } from '@core/services/practica.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { PracticaFormComponent } from '@presentation/forms/practica-form/practica-form.component';

@Component({
  selector: 'app-practicas-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    PracticaFormComponent,
  ],
  templateUrl: './practicas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PracticasPageComponent implements OnInit {
  toastService = inject(ToastService);
  practicaService = inject(PracticaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  practicaList = signal<Practica[]>([]);
  practicaSelected = signal<Practica | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadPracticasList();
  }

  private loadPracticasList(): void {
    this.practicaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.practicaList.set(res.results);
        },
      });
  }

  onShowUpdateModal(item: Practica) {
    this.practicaSelected.set(item);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(item: Practica) {
    this.practicaSelected.set(item);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadPracticasList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadPracticasList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadPracticasList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.practicaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadPracticasList();
      },
    });
  }
}
