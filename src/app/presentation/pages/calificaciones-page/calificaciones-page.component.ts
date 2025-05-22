import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Actividad } from '@core/models/actividad.model';
import { Alumno } from '@core/models/alumno.model';
import { Calificacion } from '@core/models/calificacion.model';
import { Clase } from '@core/models/clase.model';
import { ActividadService } from '@core/services/actividad.service';
import { AlumnoService } from '@core/services/alumno.service';
import { CalificacionesService } from '@core/services/calificaciones.service';
import { ClaseService } from '@core/services/clase.service';

@Component({
  selector: 'app-calificaciones-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './calificaciones-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalificacionesPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  claseService = inject(ClaseService);
  actividadService = inject(ActividadService);
  calificacionService = inject(CalificacionesService);
  alumnoService = inject(AlumnoService);

  filesSelected: { [actividadId: number]: { [alumnoId: number]: File } } = {};
  calificaciones: { [actividadId: number]: { [alumnoId: number]: number } } =
    {};

  alumnosList = signal<Alumno[]>([]);
  actividadesList = signal<Actividad[]>([]);
  calificacionesList = signal<Calificacion[]>([]);

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
        this.loadCalificaciones();
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

        alumnosFiltered = alumnosFiltered.sort((a, b) => {
          const apellidoPaterno = a.apellido_paterno.localeCompare(
            b.apellido_paterno
          );

          if (apellidoPaterno !== 0) return apellidoPaterno;

          const apellidoMaterno = a.apellido_materno.localeCompare(
            b.apellido_materno
          );

          if (apellidoMaterno !== 0) return apellidoMaterno;

          return a.nombre.localeCompare(b.nombre);
        });

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

  loadCalificaciones() {
    this.calificacionService
      .obtenerCalificacionesClase(this.claseSelected()!.id)
      .subscribe((res) => {
        this.calificacionesList.set(res);

        this.calificacionesList().forEach((c) => {
          this.setCalificacion(c.calificacion, c.actividad, c.alumno);
        });
      });
  }

  onArchivoChange(event: Event, alumnoId: number, actividadId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesSelected[actividadId][alumnoId] = input.files[0];
    }
  }

  getCalificacion(actividadId: number, alumnoId: number): number | null {
    const calificacion = this.calificacionesList().find(
      (c) => c.alumno === alumnoId && c.actividad === actividadId
    );

    if (!this.calificaciones[actividadId]) {
      this.calificaciones[actividadId] = {};
    }

    if (this.calificaciones[actividadId][alumnoId] === null) {
      this.calificaciones[actividadId][alumnoId] =
        calificacion?.calificacion ?? 60;
    }

    return this.calificaciones[actividadId][alumnoId];
  }

  tieneCalificacion(actividadId: number, alumnoId: number) {
    return this.calificacionesList().find(
      (c) => c.alumno === alumnoId && c.actividad === actividadId
    )?.id;
  }

  setCalificacion(value: number, actividadId: number, alumnoId: number): void {
    if (!this.calificaciones[actividadId]) {
      this.calificaciones[actividadId] = {};
    }

    this.calificaciones[actividadId][alumnoId] = value;
  }

  enviarActividad(actividadId: number) {
    for (const alumno of this.alumnosList()) {
      const calificacion = this.calificaciones[actividadId]?.[alumno.id];
      if (calificacion == null) continue;

      const tieneCalificacion = this.tieneCalificacion(actividadId, alumno.id);

      if (tieneCalificacion) {
        this.calificacionService
          .actualizar(tieneCalificacion!, { calificacion })
          .subscribe();

        continue;
      }

      const data: Partial<Calificacion> = {
        alumno: alumno.id,
        actividad: actividadId,
        clase: this.claseSelected()!.id,
        calificacion,
      };

      this.calificacionService.crear(data).subscribe();
    }
  }
}
