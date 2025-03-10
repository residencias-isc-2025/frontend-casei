import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { AdscripcionData } from '@interfaces/index';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';
import {
  AddAreaAdscripcionComponent,
  UpdateAreaAdscripcionComponent,
} from '@presentation/modals';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-enrolled-page',
  imports: [
    CommonModule,
    PaginationComponent,
    AddAreaAdscripcionComponent,
    UpdateAreaAdscripcionComponent,
    SearchBarComponent,
  ],
  templateUrl: './enrolled-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnrolledPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public totalItems = signal(0);
  public currentPage = signal(1);

  public adscripciones = signal<AdscripcionData[]>([]);
  public adscripcionSelected = signal<AdscripcionData | null>(null);
  public searchParams = signal<SearchParams | undefined>(undefined);

  ngOnInit(): void {
    this.searchParams.set({
      page: this.currentPage(),
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
    });

    this.cargarAdscripciones();
  }

  private cargarAdscripciones(): void {
    this.commonService.getAdscripcionesList(this.searchParams()!).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.items!);
          this.adscripciones.set(res.adscripciones || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las adscripciones.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarAdscripciones();
  }

  onShowUpdateModal(adscripcion: AdscripcionData) {
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
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.desactivarAdscripcion(idAdscripcion, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.cargarAdscripciones();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onEnableAdscripcion(idAdscripcion: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.activarAdscripcion(idAdscripcion, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.cargarAdscripciones();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  filterAdscripcionByName(searchTerm: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        nombre: searchTerm,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
  }

  filterAdscripcionBySiglas(searchTerm: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        siglas: searchTerm,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
  }

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterAdscripcionByEstado(select.value ?? '');
  }

  filterAdscripcionByEstado(estado: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        estado: estado,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
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

    this.searchParams.set({
      page: this.currentPage(), // Reiniciar la paginación a la primera página
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
      siglas: '',
      nombre: '',
      estado: '',
    });

    setTimeout(() => {
      this.cargarAdscripciones();
    }, 100);
  }
}
