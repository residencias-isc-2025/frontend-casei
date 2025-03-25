import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';
import { ProductoAcademicoFormComponent } from '@presentation/forms/producto-academico-form/producto-academico-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ProductoAcademicoService } from '@core/services/producto-academico.service';
import { ProductoAcademico } from '@core/models/productos-academicos.model';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-productos-academicos',
  imports: [
    ProductoAcademicoFormComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './productos-academicos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductosAcademicosComponent implements OnInit {
  toastService = inject(ToastService);
  productoAcademicoService = inject(ProductoAcademicoService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  productosAcademicosList = signal<ProductoAcademico[]>([]);
  productoAcademicoSelected = signal<ProductoAcademico | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadProductosAcademicosList();
  }

  private loadProductosAcademicosList(): void {
    this.productoAcademicoService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.productosAcademicosList.set(res.results);
        },
      });
  }

  onShowUpdateModel(productoAcademico: ProductoAcademico) {
    this.productoAcademicoSelected.set(productoAcademico);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(productoAcademico: ProductoAcademico) {
    this.productoAcademicoSelected.set(productoAcademico);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadProductosAcademicosList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadProductosAcademicosList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadProductosAcademicosList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.productoAcademicoService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showError(res.mensaje!, 'Éxito');
        this.loadProductosAcademicosList();
      },
    });
  }
}
