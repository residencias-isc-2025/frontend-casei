import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { ConfirmationModalComponent } from '@presentation/modals';
import { ToastService } from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ExperienciaProfesionalFormComponent } from '@presentation/forms/experiencia-profesional-form/experiencia-profesional-form.component';
import { ExperienciaProfesional } from '@core/models/experiencia-profesional.model';
import { ExperienciaProfesionalService } from '@core/services/experiencia-profesional.service';

@Component({
  selector: 'app-experiencia-profesional',
  imports: [
    ExperienciaProfesionalFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './experiencia-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienciaProfesionalComponent {
  toastService = inject(ToastService);
  experienciaProfesionalService = inject(ExperienciaProfesionalService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  experienciaProfesionalList = signal<ExperienciaProfesional[]>([]);

  experienciaProfesionalSelected = signal<ExperienciaProfesional | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadExperienciaProfesionalList();
  }

  private loadExperienciaProfesionalList(): void {
    this.experienciaProfesionalService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.experienciaProfesionalList.set(res.results);
        },
      });
  }

  onShowUpdateModal(experienciaProfesional: ExperienciaProfesional) {
    this.experienciaProfesionalSelected.set(experienciaProfesional);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(experienciaProfesional: ExperienciaProfesional) {
    this.experienciaProfesionalSelected.set(experienciaProfesional);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadExperienciaProfesionalList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadExperienciaProfesionalList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadExperienciaProfesionalList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.experienciaProfesionalService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadExperienciaProfesionalList();
      },
    });
  }
}
