import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ConfirmationModalComponent } from '@presentation/modals';
import { ToastService } from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ParticipacionService } from '@core/services/participacion.service';
import { ParticipacionFormComponent } from '@presentation/forms/participacion-form/participacion-form.component';
import { Participacion } from '@core/models/participacion.model';

@Component({
  selector: 'app-participacion',
  imports: [
    ParticipacionFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './participacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParticipacionComponent implements OnInit {
  toastService = inject(ToastService);
  participacionService = inject(ParticipacionService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  participacionList = signal<Participacion[]>([]);
  participacionSelected = signal<Participacion | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadParticipacionList();
  }

  private loadParticipacionList(): void {
    this.participacionService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.participacionList.set(res.results);
        },
      });
  }

  onShowUpdateModal(participacion: Participacion) {
    this.participacionSelected.set(participacion);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(participacion: Participacion) {
    this.participacionSelected.set(participacion);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadParticipacionList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadParticipacionList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadParticipacionList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.participacionService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showError(res.mensaje!, 'Éxito');
        this.loadParticipacionList();
      },
    });
  }
}
