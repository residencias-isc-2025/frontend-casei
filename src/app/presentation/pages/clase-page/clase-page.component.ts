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
import { User } from '@core/models/user.model';
import { AlumnoService } from '@core/services/alumno.service';
import { CarreraService } from '@core/services/carrera.service';
import { ClaseService } from '@core/services/clase.service';
import { MateriaService } from '@core/services/materia.service';
import { PeriodoService } from '@core/services/periodo.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { LoaderComponent } from '@presentation/components/loader/loader.component';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { AlumnosClaseFormComponent } from '@presentation/forms/alumnos-clase-form/alumnos-clase-form.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { SelectPeriodoFormComponent } from '@presentation/forms/select-periodo-form/select-periodo-form.component';

@Component({
  selector: 'app-clase-page',
  imports: [
    PaginationComponent,
    ConfirmationModalComponent,
    AlumnosClaseFormComponent,
    RouterModule,
    CommonModule,
    FilterBarComponent,
    LoaderComponent,
    SelectPeriodoFormComponent
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
  userService = inject(UserService);

  clasesList = signal<Clase[]>([]);
  periodosList = signal<Periodo[]>([]);
  materiasList = signal<Materia[]>([]);
  carrerasList = signal<Carrera[]>([]);
  alumnosClaseList = signal<Alumno[]>([]);
  usersList = signal<User[]>([]);
  recordFilters = signal<Record<string, any>>({});

  claseSelected = signal<Clase | null>(null);

  showDeleteModal = signal(false);
  showAlumnosClaseModal = signal(false);
  showSelectPeriodo = signal(false);

  isLoading = {
    materias: signal(true),
    carreras: signal(true),
    periodos: signal(true),
  };

  totalItems = signal(0);
  currentPage = signal(1);

  filters = signal<FilterConfig[]>([
    {
      key: 'grupo',
      label: 'Grupo',
      type: 'select',
      options: [
        { label: '1', value: '01' },
        { label: '2', value: '02' },
        { label: '3', value: '03' },
      ],
    },
    {
      key: 'materia',
      label: 'Materia',
      type: 'select',
      options: [],
    },
    {
      key: 'carrera',
      label: 'Carrera',
      type: 'select',
      options: [],
    },
    {
      key: 'periodo',
      label: 'Periodo',
      type: 'select',
      options: [],
    },
  ]);

  ngOnInit(): void {
    this.loadPeriodos();
    this.loadMaterias();
    this.loadCarreras();
    this.cargarDocentes();
    this.loadClases();
  }

  private loadClases() {
    this.claseService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
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
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay periodos registrados.',
            'Advertencia'
          );
          this.isLoading.periodos.set(false);
          return;
        }
        this.periodosList.set(res.results);

        const periodoOptions = res.results.map((p) => ({
          label: p.clave,
          value: p.id,
        }));

        periodoOptions.unshift({ label: 'Todos', value: -1 });

        this.filters.update((filtros) => {
          const updated = [...filtros];
          const index = updated.findIndex((f) => f.key === 'periodo');
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              options: periodoOptions,
            };
          }
          return updated;
        });

        this.isLoading.periodos.set(false);
      },
    });
  }

  private loadMaterias(): void {
    this.materiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay materias registradas.',
            'Advertencia'
          );
          this.isLoading.materias.set(false);
          return;
        }
        this.materiasList.set(res.results);

        const materiasOptions = res.results.map((m) => ({
          label: m.nombre,
          value: m.id,
        }));

        materiasOptions.unshift({ label: 'Todas', value: -1 });

        this.filters.update((filtros) => {
          const updated = [...filtros];
          const index = updated.findIndex((f) => f.key === 'materia');
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              options: materiasOptions,
            };
          }
          return updated;
        });

        this.isLoading.materias.set(false);
      },
    });
  }

  private loadCarreras(): void {
    this.carreraService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay carreras registradas.',
            'Advertencia'
          );
          this.isLoading.carreras.set(false);
          return;
        }

        this.carrerasList.set(res.results);

        const carreraOptions = res.results.map((c) => ({
          label: c.nombre,
          value: c.id,
        }));

        carreraOptions.unshift({ label: 'Todos', value: -1 });

        this.filters.update((filtros) => {
          const updated = [...filtros];
          const index = updated.findIndex((f) => f.key === 'carrera');
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              options: carreraOptions,
            };
          }
          return updated;
        });

        this.isLoading.carreras.set(false);
      },
    });
  }

  private cargarDocentes() {
    this.userService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        const docentesList: User[] = [];

        res.results.map((d) => {
          if (d.role === 'user') docentesList.push(d);
        });

        if (docentesList.length === 0) {
          this.toastService.showWarning(
            'No hay áreas de adscripción registradas',
            'Advertencia'
          );
          return;
        }

        this.usersList.set(docentesList);
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

  onMigrarPressed(item: Clase) {
    this.claseSelected.set(item);
    this.showSelectPeriodo.set(true);
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

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.loadClases();
  }

  docenteData(idDocente: number) {
    const docente = this.userService.obtenerDataInfo(
      idDocente,
      this.usersList()
    );

    if (!docente) return null;

    return `${docente.nombre}  ${docente.apellido_paterno} ${docente.apellido_materno}`;
  }

  onMigrarEmit() {
    this.claseSelected.set(null);
    this.showSelectPeriodo.set(false);
    this.loadClases();
  }
}
