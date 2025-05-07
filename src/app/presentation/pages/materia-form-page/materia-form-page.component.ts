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
import { Bibliografia } from '@core/models/bibliografia.model';
import { Competencia } from '@core/models/competencia.model';
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { Materia } from '@core/models/materia.model';
import { BibliografiaService } from '@core/services/bibliografia.service';
import { CompetenciaService } from '@core/services/competencia.service';
import { CriterioDesempenioService } from '@core/services/criterio-desempenio.service';
import { MateriaService } from '@core/services/materia.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-materia-form-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
  ],
  templateUrl: './materia-form-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MateriaFormPageComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  materiaService = inject(MateriaService);

  competenciaService = inject(CompetenciaService);
  criterioDesempenioService = inject(CriterioDesempenioService);
  bibliografiaService = inject(BibliografiaService);

  materiasOptions = signal<Materia[]>([]);
  competenciasOptions = signal<Competencia[]>([]);
  criteriosDesempenioOptions = signal<CriterioDesempenio[]>([]);
  bibliografiasOptions = signal<Bibliografia[]>([]);

  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditing = false;
  materiaId: number | null = null;

  currentPage = {
    materias: signal(1),
    competencias: signal(1),
    criterios: signal(1),
    bibliografia: signal(1),
  };

  readonly ITEMS_PER_PAGE = 6;

  form = this.fb.group({
    clave: ['', Validators.required],
    nombre: ['', Validators.required],
    competencias: [[] as number[]],
    creditos_requeridos: [0, Validators.required],
    materias_requeridas: [[] as number[]],
    semestre: [''],
    tipo_curso: [true, Validators.required],
    creditos_teoria: [0, Validators.required],
    creditos_practica: [0, Validators.required],
    horas_ciencias_basicas: [0],
    horas_ciencias_ingenieria: [0],
    horas_ingenieria_aplicada: [0],
    horas_disenio_ingenieril: [0],
    horas_ciencias_sociales: [0],
    horas_ciencias_economicas: [0],
    horas_otros_cursos: [0],
    objetivo_general: ['', Validators.required],
    indicador_descripcion: ['', Validators.required],
    criterio_desempeno: [[] as number[]],
    bibliografia: [[] as number[]],
  });

  ngOnInit(): void {
    this.cargarMaterias();
    this.cargarCompetencias();
    this.cargarCriteriosDesempenio();
    this.cargarBibliografias();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;
      this.materiaId = +id;
      this.cargarMateria(this.materiaId);
    }
  }

  cargarMateria(id: number) {
    this.materiaService.obtenerItemById(id).subscribe({
      next: (res) => this.form.patchValue(res),
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  cargarMaterias() {
    this.materiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      next: (res) => {
        const dataFiltered = res.results.filter((m) => m.id !== this.materiaId);

        this.materiasOptions.set(dataFiltered);
        if (dataFiltered.length === 0) this.currentPage.materias.set(0);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  cargarCompetencias() {
    this.competenciaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      next: (res) => {
        this.competenciasOptions.set(res.results);
        if (res.count === 0) this.currentPage.competencias.set(0);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  cargarCriteriosDesempenio() {
    this.criterioDesempenioService.obtenerDatosPaginados(1, 100, {}).subscribe({
      next: (res) => {
        this.criteriosDesempenioOptions.set(res.results);
        if (res.count === 0) this.currentPage.criterios.set(0);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  cargarBibliografias() {
    this.bibliografiaService.obtenerDatosPaginados(1, 100, {}).subscribe({
      next: (res) => {
        this.bibliografiasOptions.set(res.results);
        if (res.count === 0) this.currentPage.bibliografia.set(0);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
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

  formatBibliografiaBibTeX(bib: Bibliografia): string {
    const autorKey = bib.autor
      ? bib.autor.split(' ')[0]?.toLowerCase()
      : 'autor';
    return `@book{${autorKey}${bib.anio},
    title={${bib.nombre}},
    author={${bib.autor || 'Sin autor'}},
    year={${bib.anio}},
    publisher={${bib.ieee}},
    issn={${bib.isssn}},
    type={${bib.tipo || 'Desconocido'}}
  }`;
  }

  paginate<T>(list: T[], page: number): T[] {
    const start = (page - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;
    return list.slice(start, end);
  }

  get totalPages() {
    return {
      materias: Math.ceil(this.materiasOptions().length / this.ITEMS_PER_PAGE),
      competencias: Math.ceil(
        this.competenciasOptions().length / this.ITEMS_PER_PAGE
      ),
      criterios: Math.ceil(
        this.criteriosDesempenioOptions().length / this.ITEMS_PER_PAGE
      ),
      bibliografia: Math.ceil(
        this.bibliografiasOptions().length / this.ITEMS_PER_PAGE
      ),
    };
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValues = this.form.value;

    const data: Partial<Materia> = {
      clave: formValues.clave ?? '',
      nombre: formValues.nombre ?? '',
      competencias: formValues.competencias ?? [],
      creditos_requeridos: formValues.creditos_requeridos ?? 0,
      materias_requeridas: formValues.materias_requeridas ?? [],
      semestre: formValues.semestre ?? '',
      tipo_curso: formValues.tipo_curso ?? true,
      creditos_teoria: formValues.creditos_teoria ?? 0,
      creditos_practica: formValues.creditos_practica ?? 0,
      horas_ciencias_basicas: formValues.horas_ciencias_basicas ?? 0,
      horas_ciencias_ingenieria: formValues.horas_ciencias_ingenieria ?? 0,
      horas_ingenieria_aplicada: formValues.horas_ingenieria_aplicada ?? 0,
      horas_disenio_ingenieril: formValues.horas_disenio_ingenieril ?? 0,
      horas_ciencias_sociales: formValues.horas_ciencias_sociales ?? 0,
      horas_ciencias_economicas: formValues.horas_ciencias_economicas ?? 0,
      horas_otros_cursos: formValues.horas_otros_cursos ?? 0,
      objetivo_general: formValues.objetivo_general ?? '',
      indicador_descripcion: formValues.indicador_descripcion ?? '',
      criterio_desempeno: formValues.criterio_desempeno ?? [],
      bibliografia: formValues.bibliografia ?? [],
    };

    const totalCreditos = data.creditos_teoria! + data.creditos_practica!;

    const totalHoras =
      data.horas_ciencias_basicas! +
      data.horas_ciencias_ingenieria! +
      data.horas_ingenieria_aplicada! +
      data.horas_disenio_ingenieril! +
      data.horas_ciencias_sociales! +
      data.horas_ciencias_economicas! +
      data.horas_otros_cursos!;

    if (totalCreditos !== totalHoras) {
      this.toastService.showWarning(
        'La suma de los créditos no coincide con la suma total de horas',
        'Validación'
      );
      return;
    }

    const action = this.isEditing
      ? this.materiaService.actualizar(this.materiaId!, data)
      : this.materiaService.crear(data);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.router.navigateByUrl('/dashboard/materias');
      },
      error: (response) => {
        for (const [key, messages] of Object.entries(response.error)) {
          const fieldName = this.formatFieldName(key);
          this.handleMateriaErrors(messages, fieldName);
        }
      },
    });
  }

  private handleMateriaErrors(error: any, title: string) {
    if (error === undefined) return;
    this.toastService.showError(error[0], title);
  }

  private formatFieldName(key: string): string {
    const map: Record<string, string> = {
      bibliografia: 'Bibliografía',
      competencias: 'Competencias',
      criterio_desempeno: 'Criterios de desempeño',
      clave: 'Clave',
    };

    return (
      map[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    );
  }
}
