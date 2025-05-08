import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { SubTemas } from '../../../core/models/sub-temas.model';
import { SubTemaService } from '@core/services/sub-tema.service';
import { ActividadAprendizajeService } from '@core/services/actividad-aprendizaje.service';
import { EstrategiaEnsenanzaService } from '@core/services/estrategia-ensenanza.service';
import { CompetenciaGenericaService } from '@core/services/competencia-generica.service';
import { IndicadorAlcanceService } from '@core/services/indicador-alcance.service';
import { NivelDesempenioService } from '@core/services/nivel-desempenio.service';
import { ListaCotejoService } from '@core/services/lista-cotejo.service';
import { ActividadAprendizaje } from '@core/models/actividad-aprendizaje.model';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { CompetenciaGenerica } from '@core/models/competencia-generica.model';
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { NivelDesempenio } from '@core/models/nivel-desempenio.model';
import { ListaCotejo } from '@core/models/lista-cotejo.model';
import { SubtemaFormComponent } from '@presentation/forms/subtema-form/subtema-form.component';

@Component({
  selector: 'app-subtemas-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    SubtemaFormComponent,
  ],
  templateUrl: './subtemas-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SubtemasPageComponent implements OnInit {
  toastService = inject(ToastService);
  subtemaService = inject(SubTemaService);

  actividadAprendizajeService = inject(ActividadAprendizajeService);
  estrategiaEnsenanzaService = inject(EstrategiaEnsenanzaService);
  competenciaGenericaService = inject(CompetenciaGenericaService);
  indicadorAlcanceService = inject(IndicadorAlcanceService);
  nivelDesempenioService = inject(NivelDesempenioService);
  listaCotejoService = inject(ListaCotejoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  subtemaSelected = signal<SubTemas | null>(null);
  subtemasList = signal<SubTemas[]>([]);
  actividadAprendizajeList = signal<ActividadAprendizaje[]>([]);
  estrategiasEnsenanzaList = signal<EstrategiaEnsenanza[]>([]);
  competenciaGenericaList = signal<CompetenciaGenerica[]>([]);
  indicadorAlcanceList = signal<IndicadorAlcance[]>([]);
  nivelDesempenioList = signal<NivelDesempenio[]>([]);
  listaCotejoList = signal<ListaCotejo[]>([]);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadActividadAprendizajeList();
    this.loadEstrategiasEnsenanzaList();
    this.loadCompetenciaGenericaList();
    this.loadIndicadorAlcanceList();
    this.loadNivelDesempenioList();
    this.loadListaCotejoList();

    this.loadSubtemasList();
  }

  private loadSubtemasList(): void {
    this.subtemaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.subtemasList.set(res.results);
        },
      });
  }

  private loadActividadAprendizajeList(): void {
    this.actividadAprendizajeService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.actividadAprendizajeList.set(res.results);

          if (res.count === 0) {
            this.toastService.showWarning(
              'No hay actividades de aprendizaje registradas.',
              'Advertencia'
            );
          }
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
          if (res.count === 0) {
            this.toastService.showWarning(
              'No hay estrategias de enseñanza registradas.',
              'Advertencia'
            );
          }
        },
      });
  }

  private loadCompetenciaGenericaList(): void {
    this.competenciaGenericaService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.competenciaGenericaList.set(res.results);
          if (res.count === 0) {
            this.toastService.showWarning(
              'No hay competencias genéricas registradas.',
              'Advertencia'
            );
          }
        },
      });
  }

  private loadIndicadorAlcanceList(): void {
    this.indicadorAlcanceService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.indicadorAlcanceList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay indicadores de alcance registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private loadNivelDesempenioList(): void {
    this.nivelDesempenioService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.nivelDesempenioList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay niveles de desempeño registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private loadListaCotejoList(): void {
    this.listaCotejoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.listaCotejoList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay listas de cotejo registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadSubtemasList();
  }

  onSaveEmit() {
    this.loadSubtemasList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadSubtemasList();
    this.showUpdateModal.set(false);
  }

  onShowUpdateModal(subtema: SubTemas) {
    this.subtemaSelected.set(subtema);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(subtema: SubTemas) {
    this.subtemaSelected.set(subtema);
    this.showDeleteModal.set(true);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.subtemaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadSubtemasList();
      },
    });
  }

  actividadAprendizaje(idActividad: number) {
    return this.actividadAprendizajeService.obtenerDataInfo(
      idActividad,
      this.actividadAprendizajeList()
    );
  }

  estrategiaEnsenanza(idEstrategia: number) {
    return this.estrategiaEnsenanzaService.obtenerDataInfo(
      idEstrategia,
      this.estrategiasEnsenanzaList()
    );
  }

  competenciaGenerica(idCompetenciaG: number) {
    return this.competenciaGenericaService.obtenerDataInfo(
      idCompetenciaG,
      this.competenciaGenericaList()
    );
  }

  indicadorAlcance(idIndicador: number) {
    return this.indicadorAlcanceService.obtenerDataInfo(
      idIndicador,
      this.indicadorAlcanceList()
    );
  }

  nivelDesempenio(idIndicador: number) {
    return this.nivelDesempenioService.obtenerDataInfo(
      idIndicador,
      this.nivelDesempenioList()
    );
  }

  listaCotejo(idLista: number) {
    return this.listaCotejoService.obtenerDataInfo(
      idLista,
      this.listaCotejoList()
    );
  }
}
