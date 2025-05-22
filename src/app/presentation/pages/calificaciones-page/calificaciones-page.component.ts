import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actividad } from '@core/models/actividad.model';
import { Alumno } from '@core/models/alumno.model';
import { Clase } from '@core/models/clase.model';
import { ActividadService } from '@core/services/actividad.service';
import { AlumnoService } from '@core/services/alumno.service';
import { ClaseService } from '@core/services/clase.service';

@Component({
  selector: 'app-calificaciones-page',
  imports: [CommonModule],
  templateUrl: './calificaciones-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalificacionesPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  claseService = inject(ClaseService);
  actividadService = inject(ActividadService);
  alumnoService = inject(AlumnoService);

  alumnosList = signal<Alumno[]>([]);
  actividadesList = signal<Actividad[]>([]);

  claseSelected = signal<Clase | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClase(+id);
    }
  }

  loadClase(claseId: number) {
    this.claseService.obtenerItemById(claseId).subscribe({
      next: (res) => {
        this.claseSelected.set(res);
        this.loadAlumnosClase();
        this.loadActividades();
      },
    });
  }

  loadAlumnosClase() {
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

        this.alumnosList.set(alumnosFiltered);
      });
  }

  loadActividades() {
    this.actividadService
      .obtenerActividadesClase(this.claseSelected()!.id)
      .subscribe({
        next: (res) => {
          this.actividadesList.set(res);
        },
      });
  }
}
