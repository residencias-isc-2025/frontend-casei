import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Competencia } from '@core/models/competencia.model';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { Tema } from '@core/models/tema.model';
import { CompetenciaService } from '@core/services/competencia.service';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { TemaService } from '@core/services/tema.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { CompetenciaFormComponent } from '@presentation/forms/competencia-form/competencia-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-competencias-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    CompetenciaFormComponent,
  ],
  templateUrl: './competencias-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CompetenciasPageComponent implements OnInit {
  toastService = inject(ToastService);
  competenciaService = inject(CompetenciaService);
  temaService = inject(TemaService);
  objetivoEspecificoService = inject(ObjetivosEspecificosService);

  competencias = signal<Competencia[]>([]);
  competenciaSelected = signal<Competencia | null>(null);
  temasList = signal<Tema[]>([]);
  objetivosEspecificosList = signal<ObjetivoEspecifico[]>([]);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadObjetivosEspecificos();
    this.loadTemasList();

    this.loadCompetenciasList();
  }

  private loadCompetenciasList(): void {
    this.competenciaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.competencias.set(res.results);
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

  private loadTemasList(): void {
    this.temaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.temasList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay temas registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadCompetenciasList();
  }

  onShowUpdateModal(item: Competencia) {
    this.competenciaSelected.set(item);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(item: Competencia) {
    this.competenciaSelected.set(item);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadCompetenciasList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadCompetenciasList();
    this.showUpdateModal.set(false);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.competenciaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadCompetenciasList();
      },
    });
  }

  objetivoEspecifico(id: number) {
    return this.objetivoEspecificoService.obtenerDataInfo(
      id,
      this.objetivosEspecificosList()
    );
  }

  temaData(id: number) {
    return this.temaService.obtenerDataInfo(id, this.temasList());
  }
}
