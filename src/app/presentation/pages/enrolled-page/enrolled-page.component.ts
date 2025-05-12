import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Adscripcion } from '@core/models/adscripcion.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { CommonService } from '@core/services/common.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { AdscripcionFormComponent } from '@presentation/forms/adscripcion-form/adscripcion-form.component';

@Component({
  selector: 'app-enrolled-page',
  imports: [
    CommonModule,
    PaginationComponent,
    AdscripcionFormComponent,
    FilterBarComponent,
  ],
  templateUrl: './enrolled-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnrolledPageComponent implements OnInit {
  toastService = inject(ToastService);
  adscripcionService = inject(AdscripcionService);
  commonService = inject(CommonService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  adscripciones = signal<Adscripcion[]>([]);
  adscripcionSelected = signal<Adscripcion | null>(null);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters: FilterConfig[] = [
    { key: 'siglas', label: 'siglas', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'estado',
      label: 'Estado',
      type: 'boolean',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' },
      ],
    },
  ];

  ngOnInit(): void {
    this.cargarAdscripciones();
  }

  private cargarAdscripciones(): void {
    this.adscripcionService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.adscripciones.set(res.results);
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarAdscripciones();
  }

  onShowUpdateModal(adscripcion: Adscripcion) {
    this.adscripcionSelected.set(adscripcion);
    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarAdscripciones();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarAdscripciones();
  }

  onDisableAdscripcion(idAdscripcion: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.adscripcionService.deshabilitar(idAdscripcion).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarAdscripciones();
      },
    });
  }

  onEnableAdscripcion(idAdscripcion: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.adscripcionService.habilitar(idAdscripcion).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarAdscripciones();
      },
    });
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.cargarAdscripciones();
  }
}
