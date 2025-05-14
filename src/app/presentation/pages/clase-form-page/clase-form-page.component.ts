import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';

@Component({
  selector: 'app-clase-form-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
    FilterBarComponent,
  ],
  templateUrl: './clase-form-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClaseFormPageComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  claseService = inject(ClaseService);
  materiaService = inject(MateriaService);
  carreraService = inject(CarreraService);
  periodoService = inject(PeriodoService);
  alumnoService = inject(AlumnoService);
  userService = inject(UserService);

  materias = signal<Materia[]>([]);
  carreras = signal<Carrera[]>([]);
  periodos = signal<Periodo[]>([]);
  alumnos = signal<Alumno[]>([]);
  docentes = signal<User[]>([]);
  recordFilters = signal<Record<string, any>>({});

  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditing = false;
  claseId: number | null = null;
  claseSelected = signal<Clase | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  filters = signal<FilterConfig[]>([
    { key: 'matricula', label: 'Matricula', type: 'text' },
    { key: 'apellido_paterno', label: 'Apellido Paterno', type: 'text' },
    { key: 'apellido_materno', label: 'Apellido Materno', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'carrera', label: 'Carrrera', type: 'select', options: [] },
  ]);

  form = this.fb.group({
    materia: [0, Validators.required],
    grupo: ['', Validators.required],
    carrera: [0, Validators.required],
    periodo: [0, Validators.required],
    docente: [0],
    alumnos: [[] as number[]],
  });

  ngOnInit(): void {
    this.cargarMateriasList();
    this.cargarCarrerasList();
    this.cargarPeriodosList();
    this.cargarAlumnosList();
    this.cargarDocentes();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;
      this.claseId = +id;
      this.cargarClase(this.claseId);
    }
  }

  cargarClase(id: number) {
    this.claseService.obtenerItemById(id).subscribe({
      next: (res) => {
        this.claseSelected.set(res);
        this.form.patchValue(res);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  private cargarMateriasList() {
    this.materiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.materias.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay materias registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  private cargarCarrerasList() {
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
          return;
        }
        this.carreras.set(res.results);

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
      },
    });
  }

  private cargarPeriodosList() {
    this.periodoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.periodos.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay periodos registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private cargarAlumnosList() {
    this.alumnoService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.alumnos.set(res.results);
          if (res.count === 0) {
            this.toastService.showWarning(
              'No hay alumnos registrados.',
              'Advertencia'
            );
          }
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

        this.docentes.set(docentesList);
      },
    });
  }

  toggleCheckbox(controlName: string, value: number) {
    const control = this.form.get(controlName);
    const current = control?.value || [];

    if (current.includes(value)) {
      control?.setValue(current.filter((v: number) => v !== value));
    } else {
      control?.setValue([...current, value]);
    }
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.cargarAlumnosList();
  }

  carreraData(idCarrera: number) {
    return this.carreraService.obtenerDataInfo(idCarrera, this.carreras());
  }



  onSubmit() {
    if (this.form.invalid) return;

    const formValues = this.form.value;

    const payload: Partial<Clase> = {
      materia: formValues.periodo ?? 0,
      grupo: formValues.grupo ?? '',
      carrera: formValues.carrera ?? 0,
      periodo: formValues.periodo ?? 0,
      alumnos: formValues.alumnos ?? [],
      docente: formValues.docente ?? 0,
    };

    const action = this.isEditing
      ? this.claseService.actualizar(this.claseId!, payload)
      : this.claseService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.router.navigateByUrl('/dashboard/clase');
      },
      error: (response) => {
        this.toastService.showError(response.error, 'Malas noticias');
      },
    });
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.cargarAlumnosList();
  }
}
