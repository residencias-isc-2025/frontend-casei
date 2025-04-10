import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { IndicadorAlcanceService } from '@core/services/indicador-alcance.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { IndicadorAlcanceFormComponent } from '@presentation/forms/indicador-alcance-form/indicador-alcance-form.component';

@Component({
  selector: 'app-indicador-alcance-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ConfirmationModalComponent,
    IndicadorAlcanceFormComponent,
  ],
  templateUrl: './indicador-alcance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IndicadorAlcancePageComponent implements OnInit {
  toastService = inject(ToastService);
  indicadorAlcanceService = inject(IndicadorAlcanceService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  indicadoresAlcance = signal<IndicadorAlcance[]>([]);
  indicadorAlcanceSelected = signal<IndicadorAlcance | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.cargarIndicadoresAlcance();
  }

  private cargarIndicadoresAlcance(): void {
    this.indicadorAlcanceService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.indicadoresAlcance.set(res.results);
        },
      });
  }

  onShowUpdateModal(indicadorAlcance: IndicadorAlcance) {
    this.indicadorAlcanceSelected.set(indicadorAlcance);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(indicadorAlcance: IndicadorAlcance) {
    this.indicadorAlcanceSelected.set(indicadorAlcance);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.cargarIndicadoresAlcance();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.cargarIndicadoresAlcance();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarIndicadoresAlcance();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.indicadorAlcanceService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarIndicadoresAlcance();
      },
    });
  }
}
