import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Bibliografia } from '@core/models/bibliografia.model';
import { Calificacion } from '@core/models/calificacion.model';
import { Materia } from '@core/models/materia.model';
import { BibliografiaService } from '@core/services/bibliografia.service';
import { CalificacionesService } from '@core/services/calificaciones.service';
import { CedulaService } from '@core/services/cedula.service';
import { MateriaService } from '@core/services/materia.service';
import { PdfService } from '@core/services/pdf.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-materia-page',
  imports: [
    CommonModule,
    PaginationComponent,
    ConfirmationModalComponent,
    RouterModule,
    FilterBarComponent,
  ],
  templateUrl: './materia-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MateriaPageComponent implements OnInit {
  toastService = inject(ToastService);
  materiaService = inject(MateriaService);
  bibliografiaService = inject(BibliografiaService);
  calificacionesService = inject(CalificacionesService);

  cedulaService = inject(CedulaService);
  pdfService = inject(PdfService);

  showDeleteModal = signal(false);

  materiasList = signal<Materia[]>([]);
  materias = signal<Materia[]>([]);
  bibliografias = signal<Bibliografia[]>([]);

  materiaSelected = signal<Materia | null>(null);
  expandedMateriaId = signal<number | null>(null);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters = signal<FilterConfig[]>([
    { key: 'clave', label: 'Clave', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'semestre',
      label: 'Semestre',
      type: 'select',
      options: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ],
    },
    {
      key: 'is_active',
      label: 'Tipo de curso',
      type: 'select',
      options: [
        { label: 'Todos', value: undefined },
        { label: 'Obligatorio', value: true },
        { label: 'Optativo', value: false },
      ],
    },
  ]);

  ngOnInit(): void {
    this.cargarMateriasList();
    this.cargarMateriasRequeridasList();
    this.cargarBibliografias();
  }

  private cargarMateriasList() {
    this.materiaService
      .obtenerDatosPaginados(this.currentPage(), 9, this.recordFilters())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.count === 0) this.currentPage.set(0);
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
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay bibliografías registradas.',
            'Advertencia'
          );
        }
      },
    });
  }

  onDownloadProgramaAsignatura(materia: Materia) {
    this.cedulaService.obtenerProgramaAsignatura(materia.id).subscribe({
      next: (response) => {
        const calificacionesPorClase = new Map<number, Map<number, number[]>>();

        const clases = response.clases;
        let solicitudes = 0;

        for (const clase of clases) {
          solicitudes++;
          this.calificacionesService
            .obtenerCalificacionesClase(clase.id)
            .subscribe({
              next: (res) => {
                for (const calificacion of res) {
                  const idClase = calificacion.clase;
                  const idAlumno = calificacion.alumno;

                  if (!calificacionesPorClase.has(idClase)) {
                    calificacionesPorClase.set(idClase, new Map());
                  }

                  const alumnosMap = calificacionesPorClase.get(idClase)!;

                  if (!alumnosMap.has(idAlumno)) {
                    alumnosMap.set(idAlumno, []);
                  }

                  alumnosMap.get(idAlumno)!.push(calificacion.calificacion);
                }

                solicitudes--;
                if (solicitudes === 0) {
                  const resultadoFinal: {
                    claseId: number;
                    alumnos: { alumnoId: number; promedio: number }[];
                  }[] = [];

                  for (const [
                    claseId,
                    alumnosMap,
                  ] of calificacionesPorClase.entries()) {
                    const alumnos: { alumnoId: number; promedio: number }[] =
                      [];

                    for (const [alumnoId, califs] of alumnosMap.entries()) {
                      const promedio =
                        califs.reduce((acc, curr) => acc + curr, 0) /
                        califs.length;
                      alumnos.push({
                        alumnoId,
                        promedio: Math.round(promedio),
                      });
                    }

                    resultadoFinal.push({ claseId, alumnos });
                  }

                  console.log(resultadoFinal);

                  let sumaTotal = 0;
                  let totalAlumnos = 0;

                  for (const clase of resultadoFinal) {
                    for (const alumno of clase.alumnos) {
                      sumaTotal += alumno.promedio;
                      totalAlumnos += 1;
                    }
                  }

                  const promedioGeneral =
                    totalAlumnos > 0 ? Math.round(sumaTotal / totalAlumnos) : 0;

                  response.calificacion = promedioGeneral;

                  let alumnosQueSuperan = 0;

                  for (const clase of resultadoFinal) {
                    for (const alumno of clase.alumnos) {
                      if (alumno.promedio >= promedioGeneral) {
                        alumnosQueSuperan += 1;
                      }
                    }
                  }

                  const porcentajeSuperan =
                    totalAlumnos > 0
                      ? Math.round((alumnosQueSuperan / totalAlumnos) * 100)
                      : 0;

                  response.porcentaje_aprobacion_superado = `${porcentajeSuperan}%`;

                  let alumnosReprobados = 0;

                  for (const clase of resultadoFinal) {
                    for (const alumno of clase.alumnos) {
                      if (alumno.promedio < 70) {
                        alumnosReprobados += 1;
                      }
                    }
                  }

                  const porcentajeReprobacion =
                    totalAlumnos > 0
                      ? Math.round((alumnosReprobados / totalAlumnos) * 100)
                      : 0;

                  response.porcentaje_reprobacion = `${porcentajeReprobacion}%`;

                  this.pdfService.generarProgramaCurso(response);
                }
              },
            });
        }
      },
      error: (err) => {
        this.toastService.showError(err.mensaje, 'Malas noticias...');
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

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.cargarMateriasList();
  }
}
