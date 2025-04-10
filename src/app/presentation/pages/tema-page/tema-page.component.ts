import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { EstrategiaEvaluacion } from '@core/models/estrategia-evaluacion.model';
import { Practica } from '@core/models/practica.model';
import { Tema } from '@core/models/tema.model';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CriterioDesempenioService } from '@core/services/criterio-desempenio.service';
import { EstrategiaEnsenanzaService } from '@core/services/estrategia-ensenanza.service';
import { EstrategiaEvaluacionService } from '@core/services/estrategia-evaluacion.service';
import { PracticaService } from '@core/services/practica.service';
import { TemaService } from '@core/services/tema.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { SubtemasTemaFormComponent } from '@presentation/forms/subtemas-tema-form/subtemas-tema-form.component';
import { TemaAddSubtemaFormComponent } from '@presentation/forms/tema-add-subtema-form/tema-add-subtema-form.component';
import { TemaFormComponent } from '@presentation/forms/tema-form/tema-form.component';

@Component({
  selector: 'app-tema-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    TemaFormComponent,
    SubtemasTemaFormComponent,
    TemaAddSubtemaFormComponent,
  ],
  templateUrl: './tema-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TemaPageComponent implements OnInit {
  toastService = inject(ToastService);
  temaService = inject(TemaService);
  criterioDesempenioService = inject(CriterioDesempenioService);
  atributoEgresoService = inject(AtributoEgresoService);
  estrategiaEnsenanzaService = inject(EstrategiaEnsenanzaService);
  estrategiaEvaluacionService = inject(EstrategiaEvaluacionService);
  practicaService = inject(PracticaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);
  showSubtemasModal = signal(false);
  showAddSubtemaModal = signal(false);

  temaSelected = signal<Tema | null>(null);
  temasList = signal<Tema[]>([]);
  criteriosDesempenoList = signal<CriterioDesempenio[]>([]);
  atributosEgresoList = signal<AtributoEgreso[]>([]);
  estrategiasEnsenanzaList = signal<EstrategiaEnsenanza[]>([]);
  estrategiasEvaluacionList = signal<EstrategiaEvaluacion[]>([]);
  practicasList = signal<Practica[]>([]);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadAtributosEgresoList();
    this.loadCriteriosDesempenoList();
    this.loadEstrategiasEnsenanzaList();
    this.loadEstrategiasEvaluacionList();
    this.loadPracticasList();

    this.loadTemasList();
  }

  private loadTemasList(): void {
    this.temaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.temasList.set(res.results);
        },
      });
  }

  private loadCriteriosDesempenoList(): void {
    this.criterioDesempenioService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.criteriosDesempenoList.set(res.results);
      },
    });
  }

  private loadAtributosEgresoList(): void {
    this.atributoEgresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.atributosEgresoList.set(res.results);
      },
    });
  }

  private loadEstrategiasEnsenanzaList(): void {
    this.estrategiaEnsenanzaService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.estrategiasEnsenanzaList.set(res.results);
        },
      });
  }

  private loadEstrategiasEvaluacionList(): void {
    this.estrategiaEvaluacionService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.estrategiasEvaluacionList.set(res.results);
        },
      });
  }

  private loadPracticasList(): void {
    this.practicaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.practicasList.set(res.results);
      },
    });
  }

  onShowUpdateModal(estrategia: Tema) {
    this.temaSelected.set(estrategia);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(estrategia: Tema) {
    this.temaSelected.set(estrategia);
    this.showDeleteModal.set(true);
  }

  onShowSubtemasModal(tema: Tema) {
    this.temaSelected.set(tema);
    this.showSubtemasModal.set(true);
  }

  onShowAddSubtemasModal(tema: Tema) {
    this.temaSelected.set(tema);
    this.showAddSubtemaModal.set(true);
  }

  onSaveEmit() {
    this.loadTemasList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadTemasList();
    this.showUpdateModal.set(false);
  }

  onSubtemaUpdate() {
    this.loadTemasList();
    this.showSubtemasModal.set(false);
  }

  onSubtemaAdd() {
    this.loadTemasList();
    this.showAddSubtemaModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadTemasList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.temaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadTemasList();
      },
    });
  }

  atributoEgresoData(idAtributo: number) {
    return this.atributoEgresoService.atributoEgresoSiglas(
      idAtributo,
      this.atributosEgresoList()
    );
  }

  crierioDesempenoData(idCriterio: number) {
    return this.criterioDesempenioService.criterioDesempenoData(
      idCriterio,
      this.criteriosDesempenoList()
    );
  }

  estrategiaEnsenanzaData(idEnsenanza: number) {
    return this.estrategiaEnsenanzaService.estrategiaEnsenanzaData(
      idEnsenanza,
      this.estrategiasEnsenanzaList()
    );
  }

  estrategiaEvaluacionData(idEvaluacion: number) {
    return this.estrategiaEvaluacionService.estrategiaEvaluacionData(
      idEvaluacion,
      this.estrategiasEvaluacionList()
    );
  }

  practicaData(idPractica: number) {
    return this.practicaService.practicaData(idPractica, this.practicasList());
  }
}
