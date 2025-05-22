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

  // Descargar formato 2.1.1

  onDownloadProgramaAsignatura(materia: Materia) {
    this.cedulaService.obtenerProgramaAsignatura(materia.id).subscribe({
      next: (response) => {
        const calificacionesPorClase = new Map<number, Map<number, number[]>>();
        const clases = response.clases;
        let solicitudesPendientes = clases.length;

        for (const clase of clases) {
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
                  response.calificacion = promedioGeneral;
                  response.porcentaje_aprobacion_superado = `${porcentajeSuperan}%`;
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
