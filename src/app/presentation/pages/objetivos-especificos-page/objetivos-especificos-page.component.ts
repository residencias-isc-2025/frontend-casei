import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ObjetivosEspecificosFormComponent } from '@presentation/forms/objetivos-especificos-form/objetivos-especificos-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-objetivos-especificos-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    ObjetivosEspecificosFormComponent,
  ],
  templateUrl: './objetivos-especificos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ObjetivosEspecificosPageComponent implements OnInit {
  toastService = inject(ToastService);
  objetivoEspecificoService = inject(ObjetivosEspecificosService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  objetivosEspecificosList = signal<ObjetivoEspecifico[]>([]);
  objetivoEspecificoSelected = signal<ObjetivoEspecifico | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadObjetivosEspecificos();
  }

  private loadObjetivosEspecificos(): void {
    this.objetivoEspecificoService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.totalItems.set(res.count);
          this.objetivosEspecificosList.set(res.results);
        },
      });
  }

  onShowUpdateModal(objetivo: ObjetivoEspecifico) {
    this.objetivoEspecificoSelected.set(objetivo);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(objetivo: ObjetivoEspecifico) {
    this.objetivoEspecificoSelected.set(objetivo);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.loadObjetivosEspecificos();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadObjetivosEspecificos();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadObjetivosEspecificos();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.objetivoEspecificoService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadObjetivosEspecificos();
      },
    });
  }
}
