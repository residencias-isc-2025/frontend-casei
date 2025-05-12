import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Adscripcion } from '@core/models/adscripcion.model';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { Carrera } from '@core/models/carrera.model';
import { DondeTrabaja } from '@core/models/donde-trabaja.model';
import { ObjetivoEducacional } from '@core/models/objetivo-educacional.model';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { PerfilEgreso } from '@core/models/perfil-egreso.model';
import { PerfilIngreso } from '@core/models/perfil-ingreso.mode';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CarreraService } from '@core/services/carrera.service';
import { DondeTrabajaService } from '@core/services/donde-trabaja.service';
import { ObjetivoEducacionalService } from '@core/services/objetivo-educacional.service';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { PerfilEgresoService } from '@core/services/perfil-egreso.service';
import { PerfilIngresoService } from '@core/services/perfil-ingreso.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { LoaderComponent } from '@presentation/components/loader/loader.component';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-carrera-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ConfirmationModalComponent,
    RouterModule,
    FilterBarComponent,
    LoaderComponent,
  ],
  templateUrl: './carrera-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CarreraPageComponent implements OnInit {
  toastService = inject(ToastService);
  carreraService = inject(CarreraService);
  adscripcionService = inject(AdscripcionService);
  objetivoEspecificoService = inject(ObjetivosEspecificosService);
  atributoEgresoService = inject(AtributoEgresoService);
  objetivosEducacionalesService = inject(ObjetivoEducacionalService);
  dondeTrabajaService = inject(DondeTrabajaService);
  perfilIngresoService = inject(PerfilIngresoService);
  perfilEgresoService = inject(PerfilEgresoService);

  carrerasList = signal<Carrera[]>([]);
  adscripcionesList = signal<Adscripcion[]>([]);
  objetivosEducacionalesList = signal<ObjetivoEducacional[]>([]);
  objetivosEspecificosList = signal<ObjetivoEspecifico[]>([]);
  dondeTrabajaList = signal<DondeTrabaja[]>([]);
  perfilIngresoList = signal<PerfilIngreso[]>([]);
  perfilEgresoList = signal<PerfilEgreso[]>([]);

  atributosEgresoList = signal<AtributoEgreso[]>([]);

  carreraSelected = signal<Carrera | null>(null);
  expandedCarreaId = signal<number | null>(null);
  recordFilters = signal<Record<string, any>>({});

  showDeleteModal = signal(false);
  isLoading = signal(true);

  totalItems = signal(0);
  currentPage = signal(1);

  filters = signal<FilterConfig[]>([
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'area_adscripcion',
      label: 'Área de adscripcion',
      type: 'select',
      options: [],
    },
    {
      key: 'is_active',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Todos', value: undefined },
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false },
      ],
    },
  ]);

  ngOnInit(): void {
    this.loadAdscripciones();
    this.loadObjetivosEducacionales();
    this.loadObjetivosEspecificos();
    this.loadAtributosEgreso();
    this.loadDondeTrabaja();
    this.loadPerfilIngreso();
    this.loadPerfilEgreso();
    this.loadCarreras();
  }

  private loadCarreras() {
    this.carreraService
      .obtenerDatosPaginados(this.currentPage(), 9, this.recordFilters())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.carrerasList.set(res.results);
        },
      });
  }

  private loadAdscripciones() {
    this.adscripcionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        siglas: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay áreas de adscripción registradas',
              'Advertencia'
            );
            this.isLoading.set(false);
            return;
          }

          this.adscripcionesList.set(response.results);

          const adscripcionesOptions = response.results.map((a) => ({
            label: a.nombre,
            value: a.id,
          }));

          adscripcionesOptions.unshift({ label: 'Todas', value: -1 });

          this.filters.update((filtros) => {
            const updated = [...filtros];
            const index = updated.findIndex(
              (f) => f.key === 'area_adscripcion'
            );
            if (index !== -1) {
              updated[index] = {
                ...updated[index],
                options: adscripcionesOptions,
              };
            }
            return updated;
          });

          this.isLoading.set(false);
        },
      });
  }

  private loadObjetivosEducacionales() {
    this.objetivosEducacionalesService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.objetivosEducacionalesList.set(res.results);
        },
      });
  }

  private loadObjetivosEspecificos(): void {
    this.objetivoEspecificoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.objetivosEspecificosList.set(res.results);
      },
    });
  }

  private loadAtributosEgreso(): void {
    this.atributoEgresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.atributosEgresoList.set(res.results);
      },
    });
  }

  private loadDondeTrabaja(): void {
    this.dondeTrabajaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.dondeTrabajaList.set(res.results);
      },
    });
  }

  private loadPerfilIngreso(): void {
    this.perfilIngresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.perfilIngresoList.set(res.results);
      },
    });
  }

  private loadPerfilEgreso(): void {
    this.perfilEgresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.perfilEgresoList.set(res.results);
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadCarreras();
  }

  onShowDeleteModal(item: Carrera) {
    this.carreraSelected.set(item);
    this.showDeleteModal.set(true);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.carreraService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadCarreras();
      },
    });
  }

  toggleExpand(itemId: number) {
    this.expandedCarreaId.set(
      this.expandedCarreaId() === itemId ? null : itemId
    );
  }

  adscripcion(id: number) {
    return this.adscripcionService.obtenerDataInfo(
      id,
      this.adscripcionesList()
    );
  }

  objetivoEspecifico(id: number) {
    return this.objetivoEspecificoService.obtenerDataInfo(
      id,
      this.objetivosEspecificosList()
    );
  }

  atributoEgreso(id: number) {
    return this.atributoEgresoService.obtenerDataInfo(
      id,
      this.atributosEgresoList()
    );
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.loadCarreras();
  }
}
