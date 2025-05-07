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
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CarreraService } from '@core/services/carrera.service';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-carrera-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ConfirmationModalComponent,
    RouterModule,
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

  carrerasList = signal<Carrera[]>([]);
  adscripcionesList = signal<Adscripcion[]>([]);
  objetivosEspecificosList = signal<ObjetivoEspecifico[]>([]);
  atributosEgresoList = signal<AtributoEgreso[]>([]);

  carreraSelected = signal<Carrera | null>(null);
  expandedCarreaId = signal<number | null>(null);
  showDeleteModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadAdscripciones();
    this.loadObjetivosEspecificos();
    this.loadAtributosEgreso();
    this.loadCarreras();
  }

  private loadCarreras() {
    this.carreraService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
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
          this.adscripcionesList.set(response.results);

          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay áreas de adscripción registradas',
              'Advertencia'
            );
          }
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
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay objetivos específicos registrados.',
            'Advertencia'
          );
        }
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
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay atributos de egreso registrados.',
            'Advertencia'
          );
        }
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
}
