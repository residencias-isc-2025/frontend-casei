import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Bibliografia } from '@core/models/bibliografia.model';
import { Materia } from '@core/models/materia.model';
import { BibliografiaService } from '@core/services/bibliografia.service';
import { MateriaService } from '@core/services/materia.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-materia-page',
  imports: [CommonModule, PaginationComponent, ConfirmationModalComponent],
  templateUrl: './materia-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MateriaPageComponent implements OnInit {
  toastService = inject(ToastService);
  materiaService = inject(MateriaService);
  bibliografiaService = inject(BibliografiaService);

  showDeleteModal = signal(false);

  materiasList = signal<Materia[]>([]);
  materias = signal<Materia[]>([]);
  bibliografias = signal<Bibliografia[]>([]);

  materiaSelected = signal<Materia | null>(null);
  expandedMateriaId = signal<number | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.cargarMateriasList();
    this.cargarMateriasRequeridasList();
    this.cargarBibliografias();
  }

  private cargarMateriasList() {
    this.materiaService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.totalItems.set(res.count);
          this.materiasList.set(res.results);
        },
      });
  }

  private cargarMateriasRequeridasList() {
    this.materiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.materias.set(res.results);
      },
    });
  }

  private cargarBibliografias() {
    this.bibliografiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.bibliografias.set(res.results);
      },
    });
  }

  onShowDeleteModal(item: Materia) {
    this.materiaSelected.set(item);
    this.showDeleteModal.set(true);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarMateriasList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.materiaService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.cargarMateriasList();
      },
    });
  }

  toggleExpand(itemId: number) {
    this.expandedMateriaId.set(
      this.expandedMateriaId() === itemId ? null : itemId
    );
  }

  materia(itemId: number) {
    return this.materiaService.obtenerDataInfo(itemId, this.materias());
  }

  bibliografia(itemId: number) {
    return this.bibliografiaService.obtenerDataInfo(
      itemId,
      this.bibliografias()
    );
  }
}
