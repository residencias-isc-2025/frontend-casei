import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductosAcademicosResponse } from '@interfaces/index';
import { AddProductoAcademicoComponent, UpdateProductoAcademicoComponent} from '@presentation/modals';
import { CommonService, ProfileService, ToastService } from '@services/index';

@Component({
  selector: 'app-productos-academicos',
  imports: [AddProductoAcademicoComponent, UpdateProductoAcademicoComponent],
  templateUrl: './productos-academicos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductosAcademicosComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public productosAcademicosList = signal<ProductosAcademicosResponse[]>([]);

  public productoAcademicoSelected = signal<ProductosAcademicosResponse | null>(
    null
  );

  ngOnInit(): void {
    this.loadGestionAcademicaList();
  }

  private loadGestionAcademicaList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadProductosAcademicos(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.productosAcademicosList.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la actualización disciplinar.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.productosAcademicosList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.productoAcademicoSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadGestionAcademicaList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadGestionAcademicaList();
    this.showUpdateModal.set(false);
  }
}
