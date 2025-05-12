import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';

import { InstitucionService } from '@core/services/institucion.service';
import { InstitucionFormComponent } from '@presentation/forms/institucion-form/institucion-form.component';
import { Institucion } from '@core/models/institucion.model';
import { CommonService } from '@core/services/common.service';
import { Countries } from '@core/models/countries.model';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-schools-page',
  imports: [
    CommonModule,
    PaginationComponent,
    InstitucionFormComponent,
    FilterBarComponent,
  ],
  templateUrl: './schools-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SchoolsPageComponent implements OnInit {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);
  commonService = inject(CommonService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  schools = signal<Institucion[]>([]);
  countries = signal<Countries[]>([]);
  schoolSelected = signal<Institucion | null>(null);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters: FilterConfig[] = [
    { key: 'institucion', label: 'Nombre', type: 'text' },
    { key: 'pais', label: 'Pais', type: 'text' },
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
    this.cargarPaises();
    this.cargarInstituciones();
  }

  private cargarPaises(): void {
    this.commonService.obtenerListaPaises().subscribe({
      next: (res) => {
        this.countries.set(res);
      },
    });
  }

  private cargarInstituciones(): void {
    this.institucionService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
      .subscribe({
        next: (response) => {
          if (response.count === 0) this.currentPage.set(0);
          this.totalItems.set(response.count);
          this.schools.set(response.results);
        },
        error: (err) => {
          this.toastService.showError(err.mensaje!, 'Malas noticias');
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarInstituciones();
  }

  onShowUpdateModel(institucion: Institucion) {
    this.schoolSelected.set(institucion);
    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarInstituciones();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarInstituciones();
  }

  onDisableSchool(schoolId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.institucionService.deshabilitar(schoolId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarInstituciones();
      },
    });
  }

  onEnableSchool(schoolId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.institucionService.habilitar(schoolId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarInstituciones();
      },
    });
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.cargarInstituciones();
  }
}
