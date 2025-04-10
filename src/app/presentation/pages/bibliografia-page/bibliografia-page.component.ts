import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Bibliografia } from '@core/models/bibliografia.model';
import { BibliografiaService } from '@core/services/bibliografia.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { BibliografiaFormComponent } from '@presentation/forms/bibliografia-form/bibliografia-form.component';

@Component({
  selector: 'app-bibliografia-page',
  imports: [CommonModule, PaginationComponent, BibliografiaFormComponent],
  templateUrl: './bibliografia-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BibliografiaPageComponent implements OnInit {
  toastService = inject(ToastService);
  bibliografiaService = inject(BibliografiaService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

  totalItems = signal(0);
  currentPage = signal(1);

  bibliografias = signal<Bibliografia[]>([]);
  bibliografiaSelected = signal<Bibliografia | null>(null);

  ngOnInit(): void {
    this.cargarBibliografia();
  }

  private cargarBibliografia(): void {
    this.bibliografiaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        next: (response) => {
          this.totalItems.set(response.count);
          this.bibliografias.set(response.results);
        },
        error: (err) => {
          this.toastService.showError(err.mensaje!, 'Malas noticias');
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarBibliografia();
  }

  onShowUpdateModel(idBibliografia: number) {
    const formacion = this.bibliografias().find((b) => b.id === idBibliografia);

    this.bibliografiaSelected.set(formacion !== undefined ? formacion : null);

    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarBibliografia();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarBibliografia();
  }

  onDeleteBibliografia(bibliografiaId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.bibliografiaService.deshabilitar(bibliografiaId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarBibliografia();
      },
    });
  }
}
