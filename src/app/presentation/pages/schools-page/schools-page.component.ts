import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';

import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';
import { InstitucionService } from '@core/services/institucion.service';
import { InstitucionFormComponent } from '@presentation/forms/institucion-form/institucion-form.component';
import { Institucion } from '@core/models/institucion.model';
import { CommonService } from '@core/services/common.service';
import { Countries } from '@core/models/countries.model';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-schools-page',
  imports: [
    CommonModule,
    PaginationComponent,
    InstitucionFormComponent,
    SearchBarComponent,
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

  filterName = signal<string>('');
  filterPais = signal<string>('');
  filterEstado = signal<string>('');

  totalItems = signal(0);
  schools = signal<Institucion[]>([]);
  countries = signal<Countries[]>([]);

  currentPage = signal(1);
  schoolSelected = signal<Institucion | null>(null);

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
      .obtenerDatosPaginados(this.currentPage(), 10, {
        estado: this.filterEstado(),
        nombre: this.filterName(),
        pais: this.filterPais(),
      })
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

  filterInstitucionByName(searchTerm: string) {
    this.filterName.set(searchTerm);
  }

  filterInstitucionByPais(searchTerm: string) {
    this.filterPais.set(searchTerm);
  }

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterInstitucionByEstado(select.value ?? '');
  }

  filterInstitucionByEstado(estado: string) {
    this.filterEstado.set(estado);
  }

  searchWithFilters() {
    this.cargarInstituciones();
  }

  clearAllFilters(
    searchByCountry: any,
    searchByName: any,
    selectEstado: HTMLSelectElement
  ) {
    searchByCountry.clearSearch();
    searchByName.clearSearch();

    selectEstado.selectedIndex = 0;

    this.filterPais.set('');
    this.filterName.set('');
    this.filterEstado.set('');

    setTimeout(() => {
      this.cargarInstituciones();
    }, 100);
  }
}
