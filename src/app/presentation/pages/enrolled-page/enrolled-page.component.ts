import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AdscripcionData } from '@interfaces/index';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { AddAreaAdscripcionComponent } from '@presentation/modals';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-enrolled-page',
  imports: [CommonModule, PaginationComponent, AddAreaAdscripcionComponent],
  templateUrl: './enrolled-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EnrolledPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public totalItems = signal(0);
  public currentPage = signal(1);

  public adscripciones = signal<AdscripcionData[]>([]);
  public adscripcionSelected = signal<AdscripcionData | null>(null);

  ngOnInit(): void {
    this.cargarAdscripciones();
  }

  private cargarAdscripciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .getAdscripcionesList(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.adscripciones.set(res.adscripciones || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las adscripciones.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarAdscripciones();
  }

  onShowUpdateModal(idAdscripcion: number) {}

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarAdscripciones();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarAdscripciones();
  }

  onDisableAdscripcion(idAdscripcion: number) {}

  onEnableAdscripcion(idAdscripcion: number) {}
}
