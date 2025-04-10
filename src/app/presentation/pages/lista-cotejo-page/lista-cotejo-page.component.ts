import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ListaCotejo } from '@core/models/lista-cotejo.model';
import { ListaCotejoService } from '@core/services/lista-cotejo.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ListaCotejoFormComponent } from '@presentation/forms/lista-cotejo-form/lista-cotejo-form.component';

@Component({
  selector: 'app-lista-cotejo-page',
  imports: [
    CommonModule,
    //PaginationComponent,
    ConfirmationModalComponent,
    ListaCotejoFormComponent,
  ],
  templateUrl: './lista-cotejo-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListaCotejoPageComponent implements OnInit {
  toastService = inject(ToastService);
  listaCotejoService = inject(ListaCotejoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  listasCotejo = signal<ListaCotejo[]>([]);
  listaCotejoSelected = signal<ListaCotejo | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.cargarListasCotejo();
  }

  private cargarListasCotejo(): void {
    this.listaCotejoService.obtenerDatos().subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.totalItems.set(res.length);
        this.listasCotejo.set(res);
      },
    });
  }

  onShowUpdateModal(listaCotejo: ListaCotejo) {
    this.listaCotejoSelected.set(listaCotejo);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(listaCotejo: ListaCotejo) {
    this.listaCotejoSelected.set(listaCotejo);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.cargarListasCotejo();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.cargarListasCotejo();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarListasCotejo();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.listaCotejoService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarListasCotejo();
      },
    });
  }

  downloadFile(lista: ListaCotejo) {
    this.listaCotejoService
      .descargarArchivo(lista.actividad)
      .subscribe((blob) => {
        const doc = document.createElement('a');
        doc.href = URL.createObjectURL(blob);
        doc.download = lista.nombre;
        doc.click();
      });
  }
}
