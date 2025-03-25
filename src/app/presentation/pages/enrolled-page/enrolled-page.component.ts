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
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';
import { AdscripcionFormComponent } from '@presentation/forms/adscripcion-form/adscripcion-form.component';

@Component({
  selector: 'app-enrolled-page',
  imports: [
    CommonModule,
    PaginationComponent,
    AdscripcionFormComponent,
    SearchBarComponent,
  ],
  templateUrl: './enrolled-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnrolledPageComponent implements OnInit {
  toastService = inject(ToastService);
  adscripcionService = inject(AdscripcionService);
  adscripciones = signal<Adscripcion[]>([]);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  adscripcionSelected = signal<Adscripcion | null>(null);

  filterEstado = signal<string>('');
  filterNombre = signal<string>('');
  filterSiglas = signal<string>('');

  commonService = inject(CommonService);

  ngOnInit(): void {
    this.cargarAdscripciones();
  }

  private cargarAdscripciones(): void {
    this.adscripcionService
      .obtenerDatosPaginados(this.currentPage(), 10, {
        estado: this.filterEstado(),
        nombre: this.filterNombre(),
        siglas: this.filterSiglas(),
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
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

  filterAdscripcionByName(searchTerm: string) {
    this.filterNombre.set(searchTerm);
  }

  filterAdscripcionBySiglas(searchTerm: string) {
    this.filterSiglas.set(searchTerm);
  }

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterAdscripcionByEstado(select.value ?? '');
  }

  filterAdscripcionByEstado(estado: string) {
    this.filterEstado.set(estado);
  }

  searchWithFilters() {
    this.cargarAdscripciones();
  }

  clearAllFilters(
    searchByName: any,
    searchBySiglas: any,
    selectEstado: HTMLSelectElement
  ) {
    searchBySiglas.clearSearch();
    searchByName.clearSearch();

    selectEstado.selectedIndex = 0;

    this.filterEstado.set('');
    this.filterNombre.set('');
    this.filterSiglas.set('');

    setTimeout(() => {
      this.cargarAdscripciones();
    }, 100);
  }
}
