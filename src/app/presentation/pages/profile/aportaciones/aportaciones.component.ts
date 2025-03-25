import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ConfirmationModalComponent } from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { AportacionFormComponent } from '@presentation/forms/aportacion-form/aportacion-form.component';
import { AportacionService } from '@core/services/aportacion.service';
import { Aportacion } from '@core/models/aportacion.model';

@Component({
  selector: 'app-aportaciones',
  imports: [
    AportacionFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './aportaciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AportacionesComponent implements OnInit {
  toastService = inject(ToastService);
  aportacionService = inject(AportacionService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  aportacionesList = signal<Aportacion[]>([]);
  aportacionSelected = signal<Aportacion | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadAportacionesList();
  }

  private loadAportacionesList(): void {
    this.aportacionService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.aportacionesList.set(res.results);
        },
      });
  }

  onShowUpdateModal(aportacion: Aportacion) {
    this.aportacionSelected.set(aportacion);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(aportacion: Aportacion) {
    this.aportacionSelected.set(aportacion);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadAportacionesList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadAportacionesList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadAportacionesList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.aportacionService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showError(res.mensaje!, 'Éxito');
        this.loadAportacionesList();
      },
    });
  }
}
