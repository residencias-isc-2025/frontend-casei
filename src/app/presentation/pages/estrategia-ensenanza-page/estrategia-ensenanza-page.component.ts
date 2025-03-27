import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { EstrategiaEnsenanzaService } from '@core/services/estrategia-ensenanza.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { EstrategioEnsenanzaFormComponent } from '@presentation/forms/estrategia-ensenanza-form/estrategia-ensenanza-form.component';

@Component({
  selector: 'app-estrategia-ensenanza-page',
  imports: [
    EstrategioEnsenanzaFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './estrategia-ensenanza-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EstrategiaEnsenanzaPageComponent implements OnInit {
  toastService = inject(ToastService);
  estrategiaEnsenanzaService = inject(EstrategiaEnsenanzaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  estrategiasEnsenanzaList = signal<EstrategiaEnsenanza[]>([]);
  estrategiaEnsenanzaSelected = signal<EstrategiaEnsenanza | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadPremiosList();
  }

  private loadPremiosList(): void {
    this.estrategiaEnsenanzaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.estrategiasEnsenanzaList.set(res.results);
        },
      });
  }

  onShowUpdateModal(estrategia: EstrategiaEnsenanza) {
    this.estrategiaEnsenanzaSelected.set(estrategia);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(estrategia: EstrategiaEnsenanza) {
    this.estrategiaEnsenanzaSelected.set(estrategia);
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

    this.estrategiaEnsenanzaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadPremiosList();
      },
    });
  }
}
