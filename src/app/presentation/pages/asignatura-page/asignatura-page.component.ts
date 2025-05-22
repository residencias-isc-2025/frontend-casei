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
import { Calificacion } from '@core/models/calificacion.model';
import { Carrera } from '@core/models/carrera.model';
import { Clase } from '@core/models/clase.model';
import { Materia } from '@core/models/materia.model';
import { Periodo } from '@core/models/periodo.model';
import { AlumnoService } from '@core/services/alumno.service';
import { CalificacionesService } from '@core/services/calificaciones.service';
import { CarreraService } from '@core/services/carrera.service';
import { CedulaService } from '@core/services/cedula.service';
import { ClaseService } from '@core/services/clase.service';
import { MateriaService } from '@core/services/materia.service';
import { PdfService } from '@core/services/pdf.service';
import { PeriodoService } from '@core/services/periodo.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { LoaderComponent } from '@presentation/components/loader/loader.component';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ActividadFormComponent } from '@presentation/forms/actividad-form/actividad-form.component';
import { AlumnosClaseFormComponent } from '@presentation/forms/alumnos-clase-form/alumnos-clase-form.component';

@Component({
  selector: 'app-asignatura-page',
  imports: [
    CommonModule,
    FilterBarComponent,
    PaginationComponent,
    LoaderComponent,
    AlumnosClaseFormComponent,
    ActividadFormComponent,
    RouterModule,
  ],
  templateUrl: './asignatura-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AsignaturaPageComponent implements OnInit {
  toastService = inject(ToastService);
  claseService = inject(ClaseService);
  periodoService = inject(PeriodoService);
  materiaService = inject(MateriaService);
  carreraService = inject(CarreraService);
  alumnoService = inject(AlumnoService);
  cedulaService = inject(CedulaService);
  calificacionesService = inject(CalificacionesService);
  pdfService = inject(PdfService);

  clasesList = signal<Clase[]>([]);
  periodosList = signal<Periodo[]>([]);
  materiasList = signal<Materia[]>([]);
  carrerasList = signal<Carrera[]>([]);
  alumnosClaseList = signal<Alumno[]>([]);
  recordFilters = signal<Record<string, any>>({});

  claseSelected = signal<Clase | null>(null);

  showAlumnosClaseModal = signal(false);
  showAddActivityModal = signal(false);

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
    this.loadClases();
  }

  private loadClases() {
    this.claseService
      .obtenerDatosPaginadosProfesor(
        this.currentPage(),
        10,
        this.recordFilters()
      )
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

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadClases();
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.loadClases();
  }

  onAddActividad(clase: Clase) {
    this.showAddActivityModal.set(true);
    this.claseSelected.set(clase);
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

  // Descargar formato 2.1.1
  onDownloadProgramaAsignatura(materiaId: number, claseId: number) {
    this.cedulaService.obtenerProgramaAsignatura(materiaId).subscribe({
      next: (response) => {
        const calificacionesPorClase = new Map<number, Map<number, number[]>>();
        const clases = response.clases;
        let solicitudesPendientes = clases.length;

        if (clases.length === 0) {
          response.calificacion = 'No aplica';
          response.porcentaje_aprobacion_superado = 'No aplica';
          response.porcentaje_reprobacion = 'No aplica';

          this.pdfService.generarProgramaCurso(response);
        } else {
          for (const clase of clases) {
            if (clase.id !== claseId) continue;

            this.calificacionesService
              .obtenerCalificacionesClase(clase.id)
              .subscribe({
                next: (res) => {
                  this.agruparCalificaciones(res, calificacionesPorClase);

                  solicitudesPendientes--;

                  if (solicitudesPendientes === 0) {
                    const resultadoFinal = this.calcularPromedios(
                      calificacionesPorClase
                    );
                    const totalAlumnos = this.contarAlumnos(resultadoFinal);
                    const promedioGeneral = this.calcularPromedioGeneral(
                      resultadoFinal,
                      totalAlumnos
                    );
                    const porcentajeSuperan = this.calcularPorcentajeSuperan(
                      resultadoFinal,
                      promedioGeneral,
                      totalAlumnos
                    );
                    const porcentajeReprobacion =
                      this.calcularPorcentajeReprobacion(
                        resultadoFinal,
                        totalAlumnos
                      );

                    // Insertar resultados al objeto que va al PDF
                    response.calificacion = `${promedioGeneral}`;
                    response.porcentaje_aprobacion_superado = `${porcentajeSuperan}%`;
                    response.porcentaje_reprobacion = `${porcentajeReprobacion}%`;

                    this.pdfService.generarProgramaCurso(response);
                  }
                },
              });
          }
        }
      },
      error: (err) => {
        this.toastService.showError(err.mensaje, 'Malas noticias...');
      },
    });
  }

  private agruparCalificaciones(
    res: Calificacion[],
    agrupador: Map<number, Map<number, number[]>>
  ) {
    for (const calificacion of res) {
      const { clase, alumno, calificacion: valor } = calificacion;

      if (!agrupador.has(clase)) {
        agrupador.set(clase, new Map());
      }

      const alumnosMap = agrupador.get(clase)!;

      if (!alumnosMap.has(alumno)) {
        alumnosMap.set(alumno, []);
      }

      alumnosMap.get(alumno)!.push(valor);
    }
  }

  private calcularPromedios(agrupador: Map<number, Map<number, number[]>>) {
    const resultado: {
      claseId: number;
      alumnos: { alumnoId: number; promedio: number }[];
    }[] = [];

    for (const [claseId, alumnosMap] of agrupador.entries()) {
      const alumnos: { alumnoId: number; promedio: number }[] = [];

      for (const [alumnoId, califs] of alumnosMap.entries()) {
        const promedio = califs.reduce((a, b) => a + b, 0) / califs.length;
        alumnos.push({ alumnoId, promedio: Math.round(promedio) });
      }

      resultado.push({ claseId, alumnos });
    }

    return resultado;
  }

  private contarAlumnos(resultados: { alumnos: any[] }[]) {
    return resultados.reduce((acc, clase) => acc + clase.alumnos.length, 0);
  }

  private calcularPromedioGeneral(
    resultados: { alumnos: { promedio: number }[] }[],
    total: number
  ) {
    const suma = resultados
      .flatMap((clase) => clase.alumnos)
      .reduce((acc, a) => acc + a.promedio, 0);

    return total > 0 ? Math.round(suma / total) : 0;
  }

  private calcularPorcentajeSuperan(
    resultados: { alumnos: { promedio: number }[] }[],
    promedioGeneral: number,
    total: number
  ) {
    const conteo = resultados
      .flatMap((clase) => clase.alumnos)
      .filter((a) => a.promedio >= promedioGeneral).length;

    return total > 0 ? Math.round((conteo / total) * 100) : 0;
  }

  private calcularPorcentajeReprobacion(
    resultados: { alumnos: { promedio: number }[] }[],
    total: number
  ) {
    const reprobados = resultados
      .flatMap((clase) => clase.alumnos)
      .filter((a) => a.promedio < 70).length;

    return total > 0 ? Math.round((reprobados / total) * 100) : 0;
  }
}
