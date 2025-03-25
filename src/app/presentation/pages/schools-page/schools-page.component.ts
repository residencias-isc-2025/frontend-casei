import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CountriesResponse } from '@interfaces/index';
import { ToastService, CommonService } from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';
import { InstitucionService } from '@core/services/institucion.service';
import { InstitucionFormComponent } from '@presentation/forms/institucion-form/institucion-form.component';
import { Institucion } from '@core/models/institucion.model';

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

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  filterName = signal<string>('');
  filterPais = signal<string>('');
  filterEstado = signal<string>('');

  public commonService = inject(CommonService);
  public totalItems = signal(0);
  public schools = signal<Institucion[]>([]);
  public countries = signal<CountriesResponse[]>([]);

  public currentPage = signal(1);
  public schoolSelected = signal<Institucion | null>(null);

  ngOnInit(): void {
    this.cargarPaises();
    this.cargarInstituciones();
  }

  private cargarPaises(): void {
    this.commonService.getPaisesList().subscribe({
      next: (res) => {
        if (res.ok) {
          this.countries.set(res.data || []);
        }
      },
    });
  }

  private cargarInstituciones(): void {
    this.institucionService
      .obtenerInstitucionesPaginadas(this.currentPage(), 10, {
        estado: this.filterEstado(),
        nombre: this.filterName(),
        pais: this.filterPais(),
      })
      .subscribe({
        next: (response) => {
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

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.schools().find(
      (formacion) => formacion.id === idFormacion
    );

    this.schoolSelected.set(formacion !== undefined ? formacion : null);

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

    this.institucionService.deshabilitarInstitucion(schoolId).subscribe({
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

    this.institucionService.habilitarInstitucion(schoolId).subscribe({
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
