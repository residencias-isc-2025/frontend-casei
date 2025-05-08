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
import { Adscripcion } from '@core/models/adscripcion.model';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { Carrera } from '@core/models/carrera.model';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CarreraService } from '@core/services/carrera.service';
import { DondeTrabajaService } from '@core/services/donde-trabaja.service';
import { ObjetivoEducacionalService } from '@core/services/objetivo-educacional.service';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { PerfilEgresoService } from '@core/services/perfil-egreso.service';
import { PerfilIngresoService } from '@core/services/perfil-ingreso.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ObjetivoEducacionalFormComponent } from '@presentation/forms/objetivo-educacional-form/objetivo-educacional-form.component';

interface CarreraButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-carrera-form-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationComponent,
    ObjetivoEducacionalFormComponent,
  ],
  templateUrl: './carrera-form-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CarreraFormPageComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  carreraService = inject(CarreraService);
  adscripcionService = inject(AdscripcionService);
  objetivoEspecificoService = inject(ObjetivosEspecificosService);
  atributoEgresoService = inject(AtributoEgresoService);

  adscripcionesList = signal<Adscripcion[]>([]);
  objetivosEspecificosList = signal<ObjetivoEspecifico[]>([]);
  atributosEgresoList = signal<AtributoEgreso[]>([]);

  objetivoEducacionalService = inject(ObjetivoEducacionalService);
  dondeTrabajaService = inject(DondeTrabajaService);
  perfilIngresoService = inject(PerfilIngresoService);
  perfilEgresoService = inject(PerfilEgresoService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditing = false;
  carreraId: number | null = null;
  carreraSelected = signal<Carrera | null>(null);

  currentPage = {
    adscripciones: signal(1),
    objetivosEspecificos: signal(1),
    atributosEgreso: signal(1),
  };

  showObjetivoEducacionalForm = signal<boolean>(false);
  showDondeTrabajaForm = signal<boolean>(false);
  showPerfilIngresoForm = signal<boolean>(false);
  showPerfilEgresoForm = signal<boolean>(false);

  readonly ITEMS_PER_PAGE = 6;

  carreraForm = this.fb.group({
    nombre: ['', Validators.required],
    adscripcion: [0, Validators.required],
    objetivo_especifico: [[] as number[], Validators.required],
    atributos_egreso: [[] as number[], Validators.required],
    mision: ['', Validators.required],
    vision: ['', Validators.required],
    objetivo_carrera: ['', Validators.required],
  });

  titles = [
    'Objetivos Educacionales',
    '¿Dónde trabaja?',
    'Perfil de Ingreso',
    'Perfil de Egreso',
  ];

  buttons: CarreraButtons[] = this.titles.map((t, i) => ({
    id: i + 1,
    text: t,
    action: () => this.handleClick(i + 1),
  }));

  ngOnInit(): void {
    this.loadAdscripciones();
    this.loadObjetivosEspecificos();
    this.loadAtributosEgreso();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;
      this.carreraId = +id;
      this.cargarCarrera(this.carreraId);
    }
  }

  cargarCarrera(id: number) {
    this.carreraService.obtenerItemById(id).subscribe({
      next: (res) => {
        this.carreraSelected.set(res);
        this.carreraForm.patchValue(res);
      },
      error: (err) =>
        this.toastService.showError(err.mensaje, 'Malas noticias'),
    });
  }

  private loadAdscripciones() {
    this.adscripcionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        siglas: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          this.adscripcionesList.set(response.results);

          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay áreas de adscripción registradas',
              'Advertencia'
            );
          }
        },
      });
  }

  private loadObjetivosEspecificos(): void {
    this.objetivoEspecificoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.objetivosEspecificosList.set(res.results);

        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay objetivos específicos registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  private loadAtributosEgreso(): void {
    this.atributoEgresoService.obtenerDatosPaginados(1, 100, {}).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.atributosEgresoList.set(res.results);
        if (res.count === 0) {
          this.toastService.showWarning(
            'No hay atributos de egreso registrados.',
            'Advertencia'
          );
        }
      },
    });
  }

  toggleSimpleCheckbox(controlName: string, value: number) {
    const control = this.carreraForm.get(controlName);

    control?.setValue(value);
  }

  toggleCheckbox(controlName: string, value: number) {
    const control = this.carreraForm.get(controlName);
    const current = control?.value || [];

    if (current.includes(value)) {
      control?.setValue(current.filter((v: number) => v !== value));
    } else {
      control?.setValue([...current, value]);
    }
  }

  paginate<T>(list: T[], page: number): T[] {
    const start = (page - 1) * this.ITEMS_PER_PAGE;
    const end = start + this.ITEMS_PER_PAGE;
    return list.slice(start, end);
  }

  handleClick(id: number) {
    switch (id) {
      case 1:
        this.showObjetivoEducacionalForm.set(true);
        break;
      case 2:
        this.showDondeTrabajaForm.set(true);
        break;
      case 3:
        this.showPerfilIngresoForm.set(true);
        break;
      case 4:
        this.showPerfilEgresoForm.set(true);
        break;
    }
  }

  onSubmit() {
    if (this.carreraForm.invalid) return;

    const formValues = this.carreraForm.value;

    const data: Partial<Carrera> = {
      nombre: formValues.nombre ?? '',
      adscripcion: formValues.adscripcion ?? 0,
      objetivo_especifico: formValues.objetivo_especifico ?? [],
      atributos_egreso: formValues.atributos_egreso ?? [],
      mision: formValues.mision ?? '',
      vision: formValues.vision ?? '',
      objetivo_carrera: formValues.objetivo_carrera ?? '',
    };

    const action = this.isEditing
      ? this.carreraService.actualizar(this.carreraId!, data)
      : this.carreraService.crear(data);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.router.navigateByUrl('/dashboard/carrera');
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
      atributos_egreso: 'Atributos de egreso',
    };

    return (
      map[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    );
  }
}
