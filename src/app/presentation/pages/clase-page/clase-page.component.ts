import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Alumno } from '@core/models/alumno.model';
import { Carrera } from '@core/models/carrera.model';
import { Clase } from '@core/models/clase.model';
import { Materia } from '@core/models/materia.model';
import { Periodo } from '@core/models/periodo.model';
import { AlumnoService } from '@core/services/alumno.service';
import { CarreraService } from '@core/services/carrera.service';
import { ClaseService } from '@core/services/clase.service';
import { MateriaService } from '@core/services/materia.service';
import { PeriodoService } from '@core/services/periodo.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { AlumnosClaseFormComponent } from '@presentation/forms/alumnos-clase-form/alumnos-clase-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-clase-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    AlumnosClaseFormComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './clase-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClasePageComponent implements OnInit {
  toastService = inject(ToastService);
  claseService = inject(ClaseService);
  periodoService = inject(PeriodoService);
  materiaService = inject(MateriaService);
  carreraService = inject(CarreraService);
  alumnoService = inject(AlumnoService);

  clasesList = signal<Clase[]>([]);
  periodosList = signal<Periodo[]>([]);
  materiasList = signal<Materia[]>([]);
  carrerasList = signal<Carrera[]>([]);

  alumnosClaseList = signal<Alumno[]>([]);

  claseSelected = signal<Clase | null>(null);

  showDeleteModal = signal<boolean>(false);
  showAlumnosClaseModal = signal<boolean>(false);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    this.loadPeriodos();
    this.loadMaterias();
    this.loadCarreras();
    this.loadClases();
  }

  private loadClases() {
    this.claseService
      .obtenerDatosPaginados(this.currentPage(), 10, {})
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
          this.clasesList.set(res.results);
          this.totalItems.set(res.count);
        },
      });
  }

  private loadPeriodos(): void {
    this.periodoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.periodosList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay periodos registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private loadMaterias(): void {
    this.materiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.materiasList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay materias registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  private loadCarreras(): void {
    this.carreraService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.carrerasList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay carreras registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadClases();
  }

  onShowDeleteModal(item: Clase) {
    this.claseSelected.set(item);
    this.showDeleteModal.set(true);
  }

  periodoData(idPeriodo: number): Periodo | undefined {
    return this.periodoService.obtenerDataInfo(idPeriodo, this.periodosList());
  }

  materiaData(idMateria: number): Materia | undefined {
    return this.materiaService.obtenerDataInfo(idMateria, this.materiasList());
  }

  carreraData(idCarrera: number): Carrera | undefined {
    return this.carreraService.obtenerDataInfo(idCarrera, this.carrerasList());
  }

  claseActiva(periodo: Periodo | undefined): boolean {
    if (periodo === undefined) return false;
    const hoy = new Date().toISOString().split('T')[0];
    return periodo.fecha_fin > hoy ? true : false;
  }

  loadAlumnosClase(clase: Clase) {
    this.claseSelected.set(clase);

    let countAlumnos = 0;

    this.alumnoService.totalRegistros().subscribe((res) => {
      countAlumnos = res.total_alumnos;
    });

    if (countAlumnos < 10) countAlumnos = 10;

    this.alumnoService
      .obtenerDatosPaginados(1, countAlumnos, {})
      .subscribe((res) => {
        let alumnosFiltered = [];

        for (const a of res.results) {
          if (!this.claseSelected()?.alumnos.includes(a.id)) continue;
          alumnosFiltered.push(a);
        }

        this.alumnosClaseList.set(alumnosFiltered);
        this.showAlumnosClaseModal.set(true);
      });
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    this.claseService.deshabilitar(itemId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadCarreras();
      },
    });
  }
}
