import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { PeriodoData } from '@interfaces/index';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ToastService, CommonService } from '@presentation/services';
import { AddPeriodoComponent } from '@modals/periodos/add-periodo/add-periodo.component';
import { UpdatePeriodoComponent } from '@modals/periodos/update-periodo/update-periodo.component';
import { SearchBarComponent } from '@presentation/components/search-bar/search-bar.component';

@Component({
  selector: 'app-periodos-page',
  imports: [
    CommonModule,
    PaginationComponent,
    AddPeriodoComponent,
    UpdatePeriodoComponent,
    SearchBarComponent,
  ],
  templateUrl: './periodos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PeriodosPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public totalItems = signal(0);
  public currentPage = signal(1);

  public periodos = signal<PeriodoData[]>([]);
  public periodoSelected = signal<PeriodoData | null>(null);
  public searchParams = signal<SearchParams | undefined>(undefined);

  ngOnInit(): void {
    this.searchParams.set({
      page: this.currentPage(),
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
    });

    this.loadPeriodos();
  }

  private loadPeriodos(): void {
    this.commonService.getPeriodosList(this.searchParams()!).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.items!);
          this.periodos.set(res.periodos || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los periodos.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);

    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });

    this.loadPeriodos();
  }

  onShowUpdateModal(periodo: PeriodoData) {
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
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.desactivarPeriodo(idPeriodo, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadPeriodos();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onEnablePeriodo(idPeriodo: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.activarPeriodo(idPeriodo, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadPeriodos();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  filterPeriodosByClave(searchTerm: string) {
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

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterPeriodosByStatus(select.value ?? '');
  }

  filterPeriodosByStatus(estado: string) {
    const activo = estado === 'activo' ? 1 : 0;

    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        activo,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
  }

  searchWithFilters() {
    this.loadPeriodos();
  }

  clearAllFilters(searchByClave: any, selectEstado: HTMLSelectElement) {
    searchByClave.clearSearch();

    selectEstado.selectedIndex = 0;

    this.searchParams.set({
      page: this.currentPage(), // Reiniciar la paginación a la primera página
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
      nombre: '',
      estado: undefined,
    });

    setTimeout(() => {
      this.loadPeriodos();
    }, 100);
  }
}
