import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { NivelDesempenio } from '@core/models/nivel-desempenio.model';
import { IndicadorAlcanceService } from '@core/services/indicador-alcance.service';
import { NivelDesempenioService } from '@core/services/nivel-desempenio.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { NivelDesempenioFormComponent } from '@presentation/forms/nivel-desempenio-form/nivel-desempenio-form.component';

@Component({
  selector: 'app-nivel-desempenio-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ConfirmationModalComponent,
    NivelDesempenioFormComponent,
  ],
  templateUrl: './nivel-desempenio-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NivelDesempenioPageComponent implements OnInit {
  toastService = inject(ToastService);
  nivelDesempenioService = inject(NivelDesempenioService);
  indicadorAlcanceService = inject(IndicadorAlcanceService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  nivelesDesempenio = signal<NivelDesempenio[]>([]);
  indicadoresAlcance = signal<IndicadorAlcance[]>([]);
  nivelDesempenioSelected = signal<NivelDesempenio | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.cargarIndicadoresAlcance();
    this.cargarNivelesDesempenio();
  }

  private cargarIndicadoresAlcance(): void {
    this.indicadorAlcanceService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.indicadoresAlcance.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay indicadores de alcance registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private cargarNivelesDesempenio(): void {
    this.nivelDesempenioService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.nivelesDesempenio.set(res.results);
        },
      });
  }

  onShowUpdateModal(nivelD: NivelDesempenio) {
    this.nivelDesempenioSelected.set(nivelD);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(nivelD: NivelDesempenio) {
    this.nivelDesempenioSelected.set(nivelD);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.cargarNivelesDesempenio();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.cargarNivelesDesempenio();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarNivelesDesempenio();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.nivelDesempenioService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarNivelesDesempenio();
      },
    });
  }

  getIndicadorData(idIndicador: number) {
    return this.indicadorAlcanceService.obtenerDataInfo(
      idIndicador,
      this.indicadoresAlcance()
    );
  }
}
