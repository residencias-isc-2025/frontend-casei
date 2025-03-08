import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CountriesResponse, InstitucionResponse } from '@interfaces/index';
import { ToastService, CommonService } from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import {
  AddInstitucionComponent,
  UpdateInstitucionComponent,
} from '@presentation/modals';

@Component({
  selector: 'app-schools-page',
  imports: [
    CommonModule,
    PaginationComponent,
    AddInstitucionComponent,
    UpdateInstitucionComponent,
  ],
  templateUrl: './schools-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SchoolsPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public totalItems = signal(0);
  public schools = signal<InstitucionResponse[]>([]);
  public countries = signal<CountriesResponse[]>([]);

  public currentPage = signal(1);
  public schoolSelected = signal<InstitucionResponse | null>(null);

  ngOnInit(): void {
    this.cargarPaises();
    this.cargarInstituciones();
  }

  private cargarPaises(): void {
    this.commonService.getPaisesList().subscribe({
      next: (res) => {
        if (res.ok) {
          this.countries.set(res.data || []);
        }
      },
    });
  }

  private cargarInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.getInstitucionesList(token, this.currentPage()).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.items!);
          this.schools.set(res.schools || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los usuarios.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarInstituciones();
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.schools().find(
      (formacion) => formacion.id === idFormacion
    );

    this.schoolSelected.set(formacion !== undefined ? formacion : null);

    this.showUpdateModal.set(true);
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.cargarInstituciones();
  }

  onEditEmit(): void {
    this.showUpdateModal.set(false);
    this.cargarInstituciones();
  }

  onDisableSchool(schoolId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.desactivarInstitucion(schoolId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.cargarInstituciones();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onEnableSchool(schoolId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.commonService.activarInstitucion(schoolId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.cargarInstituciones();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }
}
