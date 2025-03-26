import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { ToastService } from '@core/services/toast.service';
import { AtributoEgresoFormComponent } from '@presentation/forms/atributo-egreso-form/atributo-egreso-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-atributo-egreso-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    AtributoEgresoFormComponent,
  ],
  templateUrl: './atributo-egreso-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AtributoEgresoPageComponent implements OnInit {
  toastService = inject(ToastService);
  atributoEgresoService = inject(AtributoEgresoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  atributosEgresoList = signal<AtributoEgreso[]>([]);
  atributoEgresoSelected = signal<AtributoEgreso | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadAtributosEgreso();
  }

  private loadAtributosEgreso(): void {
    this.atributoEgresoService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.atributosEgresoList.set(res.results);
        },
      });
  }

  onShowUpdateModal(objetivo: AtributoEgreso) {
    this.atributoEgresoSelected.set(objetivo);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(objetivo: AtributoEgreso) {
    this.atributoEgresoSelected.set(objetivo);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadAtributosEgreso();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadAtributosEgreso();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadAtributosEgreso();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.atributoEgresoService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadAtributosEgreso();
      },
    });
  }
}
