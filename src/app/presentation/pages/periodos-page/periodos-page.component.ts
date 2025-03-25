import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ToastService } from '@presentation/services';
import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';
import { PeriodoFormComponent } from '@presentation/forms/periodo-form/periodo-form.component';
import { Periodo } from '@core/models/periodo.model';
import { PeriodoService } from '@core/services/periodo.service';

@Component({
  selector: 'app-periodos-page',
  imports: [
    CommonModule,
    PaginationComponent,
    PeriodoFormComponent,
    SearchBarComponent,
  ],
  templateUrl: './periodos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PeriodosPageComponent implements OnInit {
  toastService = inject(ToastService);
  periodoService = inject(PeriodoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  periodos = signal<Periodo[]>([]);
  periodoSelected = signal<Periodo | null>(null);

  filterActivo = signal<number | undefined>(undefined);
  filterClave = signal<string>('');

  ngOnInit(): void {
    this.loadPeriodos();
  }

  private loadPeriodos(): void {
    this.periodoService
      .obtenerDatosPaginados(this.currentPage(), 10, {
        activo: this.filterActivo(),
        clave: this.filterClave(),
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.periodos.set(res.results);
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadPeriodos();
  }

  onShowUpdateModal(periodo: Periodo) {
    this.periodoSelected.set(periodo);
    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.loadPeriodos();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.loadPeriodos();
  }

  onDisablePeriodo(idPeriodo: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.periodoService.deshabilitar(idPeriodo).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadPeriodos();
      },
    });
  }

  onEnablePeriodo(idPeriodo: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.periodoService.habilitar(idPeriodo).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadPeriodos();
      },
    });
  }

  filterPeriodosByClave(searchTerm: string) {
    this.filterClave.set(searchTerm);
  }

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterPeriodosByStatus(select.value ?? '');
  }

  filterPeriodosByStatus(estado: string) {
    const activo = estado === 'activo' ? 1 : 0;
    this.filterActivo.set(activo);
  }

  searchWithFilters() {
    this.loadPeriodos();
  }

  clearAllFilters(searchByClave: any, selectEstado: HTMLSelectElement) {
    searchByClave.clearSearch();

    selectEstado.selectedIndex = 0;

    this.filterClave.set('');
    this.filterActivo.set(undefined);

    setTimeout(() => {
      this.loadPeriodos();
    }, 100);
  }
}
