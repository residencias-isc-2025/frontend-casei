import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductosAcademicosResponse } from '@interfaces/index';
import {
  AddProductoAcademicoComponent,
  UpdateProductoAcademicoComponent,
} from '@presentation/modals';
import {
  CommonService,
  ProfileService,
  ToastService,
  UsersService,
} from '@services/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-productos-academicos',
  imports: [
    AddProductoAcademicoComponent,
    UpdateProductoAcademicoComponent,
    PaginationComponent,
  ],
  templateUrl: './productos-academicos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductosAcademicosComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public productosAcademicosList = signal<ProductosAcademicosResponse[]>([]);

  public productoAcademicoSelected = signal<ProductosAcademicosResponse | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadProductosAcademicosList();
  }

  private loadProductosAcademicosList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadProductosAcademicosFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
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
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarProductosAcademicos(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadProductosAcademicosList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las actualizaciones discilpinares.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
