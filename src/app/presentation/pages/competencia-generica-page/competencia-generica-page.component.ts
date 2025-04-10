import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CompetenciaGenerica } from '@core/models/competencia-generica.model';
import { CompetenciaGenericaService } from '@core/services/competencia-generica.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { CompetenciaGenericaFormComponent } from '@presentation/forms/competencia-generica-form/competencia-generica-form.component';

@Component({
  selector: 'app-competencia-generica-page',
  imports: [
    CommonModule,
    PaginationComponent,
    CompetenciaGenericaFormComponent,
  ],
  templateUrl: './competencia-generica-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CompetenciaGenericaPageComponent implements OnInit {
  toastService = inject(ToastService);
  competenciaGenericaService = inject(CompetenciaGenericaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  competenciasGenericas = signal<CompetenciaGenerica[]>([]);
  competenciaGenericaSelected = signal<CompetenciaGenerica | null>(null);

  ngOnInit(): void {
    this.cargarCompetenciasGenericas();
  }

  private cargarCompetenciasGenericas(): void {
    this.competenciaGenericaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        next: (response) => {
          this.totalItems.set(response.count);
          this.competenciasGenericas.set(response.results);
        },
        error: (err) => {
          this.toastService.showError(err.mensaje!, 'Malas noticias');
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarCompetenciasGenericas();
  }

  onShowUpdateModel(idCompetenciaGenerica: number) {
    const competencia = this.competenciasGenericas().find(
      (c) => c.id === idCompetenciaGenerica
    );

    this.competenciaGenericaSelected.set(
      competencia !== undefined ? competencia : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarCompetenciasGenericas();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarCompetenciasGenericas();
  }

  onDeleteCompetenciaGenerica(competenciaGenericaId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.competenciaGenericaService
      .deshabilitar(competenciaGenericaId)
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.cargarCompetenciasGenericas();
        },
      });
  }
}
