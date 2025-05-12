import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@presentation/components/pagination/pagination.component';

import { PeriodoFormComponent } from '@presentation/forms/periodo-form/periodo-form.component';
import { Periodo } from '@core/models/periodo.model';
import { PeriodoService } from '@core/services/periodo.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-periodos-page',
  imports: [
    CommonModule,
    PaginationComponent,
    PeriodoFormComponent,
    FilterBarComponent,
  ],
  templateUrl: './periodos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PeriodosPageComponent implements OnInit {
  toastService = inject(ToastService);
  periodoService = inject(PeriodoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  periodos = signal<Periodo[]>([]);
  periodoSelected = signal<Periodo | null>(null);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters: FilterConfig[] = [
    { key: 'clave', label: 'Clave', type: 'text' },
    {
      key: 'activo',
      label: 'Estado',
      type: 'boolean',
      options: [
        { label: 'Todos', value: undefined },
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
      ],
    },
  ];

  ngOnInit(): void {
    this.loadPeriodos();
  }

  private loadPeriodos(): void {
    this.periodoService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
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

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.loadPeriodos();
  }
}
