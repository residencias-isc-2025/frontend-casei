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
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { AtributoEgresoService } from '@core/services/atributo-egreso.service';
import { CarreraService } from '@core/services/carrera.service';
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';
import { ToastService } from '@core/services/toast.service';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';

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

  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditing = false;
  carreraId: number | null = null;

  currentPage = {
    adscripciones: signal(1),
    objetivosEspecificos: signal(1),
    atributosEgreso: signal(1),
  };

  readonly ITEMS_PER_PAGE = 6;

  carreraForm = this.fb.group({
    nombre: ['', Validators.required],
    adscripcion: [0, Validators.required],
    objetivo_especifico: [0, Validators.required],
    atributos_egreso: [[] as number[], Validators.required],
  });

  titles = [
    'Objetivos Educacionales',
    '¿Dónde trabaja?',
    'Perfil de Ingreso',
    'Perfil de egreso',
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
      next: (res) => this.carreraForm.patchValue(res),
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
        console.log('Objetivos educacionales');
        break;
      case 2:
        console.log('Donde trabaja');
        break;
      case 3:
        console.log('Perfil de ingreso');
        break;
      case 4:
        console.log('Perfil de egreso');
        break;
    }
  }

  onSubmit() {}
}
