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
import { ToastService } from '@core/services/toast.service';
import { ActividadFormComponent } from '@presentation/forms/actividad-form/actividad-form.component';

@Component({
  selector: 'app-calificaciones-page',
  imports: [CommonModule, FormsModule, ActividadFormComponent],
  templateUrl: './calificaciones-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalificacionesPageComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  toastService = inject(ToastService);
  claseService = inject(ClaseService);
  actividadService = inject(ActividadService);
  calificacionService = inject(CalificacionesService);
  alumnoService = inject(AlumnoService);

  showAddActivityModal = signal(false);

  filesSelected: { [actividadId: number]: { [alumnoId: number]: File } } = {};
  calificaciones: { [actividadId: number]: { [alumnoId: number]: number } } =
    {};

  alumnosEspeciales: {
    [actividadId: number]: {
      mayor?: number;
      menor?: number;
      promedio?: number;
    };
  } = {};

  alumnosList = signal<Alumno[]>([]);
  actividadesList = signal<Actividad[]>([]);
  calificacionesList = signal<Calificacion[]>([]);

  claseSelected = signal<Clase | null>(null);
  actividadSelected = signal<Actividad | null>(null);

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
    this.alumnoService.totalRegistros().subscribe({
      next: (res) => {
        this.alumnoService
          .obtenerDatosPaginados(1, res.total_alumnos, {})
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
      },
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

  onSave() {
    this.showAddActivityModal.set(false);
    this.loadClase(this.claseSelected()!.id);
  }

  onArchivoChange(event: Event, alumnoId: number, actividadId: number) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      if (!this.filesSelected[actividadId]) {
        this.filesSelected[actividadId] = {};
      }

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

  enviarActividad(actividad: Actividad) {
    const alumnos = this.alumnosList();
    const calificacionesActividad: { alumno: Alumno; calificacion: number }[] =
      [];

    for (const alumno of alumnos) {
      const calificacion = this.calificaciones[actividad.id]?.[alumno.id];
      if (calificacion == null) continue;

      calificacionesActividad.push({ alumno, calificacion });

      const calificacionExistenteId = this.tieneCalificacion(
        actividad.id,
        alumno.id
      );

      if (calificacionExistenteId) {
        this.calificacionService
          .actualizar(calificacionExistenteId!, { calificacion })
          .subscribe();

        continue;
      }

      const data: Partial<Calificacion> = {
        alumno: alumno.id,
        actividad: actividad.id,
        clase: this.claseSelected()!.id,
        calificacion,
      };

      this.calificacionService.crear(data).subscribe();
    }

    if (calificacionesActividad.length > 0) {
      const promedio =
        calificacionesActividad.reduce(
          (acc, curr) => acc + curr.calificacion,
          0
        ) / calificacionesActividad.length;

      const alumnoMayor = calificacionesActividad.reduce((a, b) =>
        a.calificacion > b.calificacion ? a : b
      );

      const alumnoMenor = calificacionesActividad.reduce((a, b) =>
        a.calificacion < b.calificacion ? a : b
      );

      let alumnoPromedio = calificacionesActividad.find(
        (a) => a.calificacion === Math.round(promedio)
      );

      if (!alumnoPromedio) {
        alumnoPromedio = calificacionesActividad.reduce((a, b) =>
          Math.abs(a.calificacion - promedio) <
          Math.abs(b.calificacion - promedio)
            ? a
            : b
        );
      }

      this.alumnosEspeciales[actividad.id] = {
        mayor: alumnoMayor.alumno.id,
        menor: alumnoMenor.alumno.id,
        promedio: alumnoPromedio?.alumno.id,
      };

      const fileAlumnoAlto =
        this.filesSelected[actividad.id]?.[alumnoMayor.alumno.id];
      const fileAlumnoPromedio =
        this.filesSelected[actividad.id]?.[alumnoPromedio.alumno.id];
      const fileAlumnoBajo =
        this.filesSelected[actividad.id]?.[alumnoMenor.alumno.id];

      const formData = new FormData();

      formData.append('alumno_alto', alumnoMayor.alumno.id.toString());
      formData.append(
        'alumno_alto_calificacion',
        alumnoMayor.calificacion.toString()
      );

      if (fileAlumnoAlto) {
        formData.append('alumno_alto_evidencia', fileAlumnoAlto);
      } else {
        this.toastService.showInfo(
          `Adjunta la evidencia del alumno con matrícula ${alumnoMayor.alumno.matricula} para la actividad correspondiente a ${actividad?.titulo}`,
          'Por favor'
        );
      }

      formData.append('alumno_promedio', alumnoPromedio.alumno.id.toString());
      formData.append(
        'alumno_promedio_calificacion',
        alumnoPromedio.calificacion.toString()
      );

      if (fileAlumnoPromedio) {
        formData.append('alumno_promedio_evidencia', fileAlumnoPromedio);
      } else {
        this.toastService.showInfo(
          `Adjunta la evidencia del alumno con matrícula ${alumnoPromedio.alumno.matricula} para la actividad correspondiente a ${actividad?.titulo}`,
          'Por favor'
        );
      }

      formData.append('alumno_bajo', alumnoMenor.alumno.id.toString());
      formData.append(
        'alumno_bajo_calificacion',
        alumnoMenor.calificacion.toString()
      );

      if (fileAlumnoBajo) {
        formData.append('alumno_bajo_evidencia', fileAlumnoBajo);
      } else {
        this.toastService.showInfo(
          `Favor de subir la evidencia del alumno con matrícula ${alumnoMenor.alumno.matricula} para la actividad correspondiente a ${actividad?.titulo}`,
          'Por favor'
        );
      }

      this.actividadService
        .actualizarActividad(actividad!.id, formData)
        .subscribe({
          next: (res) => {
            this.toastService.showSuccess(res.mensaje, 'Éxito');
            this.recargarComponente();
          },
        });
    } else {
      this.toastService.showError(
        `No hay calificaciones registradas para la actividad ${actividad?.titulo}`,
        'Malas noticias...'
      );
    }
  }

  mostrarMensajeBoton(actividad: Actividad, alumnoId: number): string {
    if (actividad?.alumno_alto === alumnoId) {
      if (actividad.alumno_alto_evidencia !== null) {
        return 'Evidencia en sistema';
      } else {
        return 'Evidencia requerida';
      }
    }

    if (actividad?.alumno_promedio === alumnoId) {
      if (actividad.alumno_promedio_evidencia !== null) {
        return 'Evidencia en sistema';
      } else {
        return 'Evidencia requerida';
      }
    }

    if (actividad?.alumno_bajo === alumnoId) {
      if (actividad.alumno_bajo_evidencia !== null) {
        return 'Evidencia en sistema';
      } else {
        return 'Evidencia requerida';
      }
    }

    return 'Evidencia';
  }

  evidenciaEnSistema(actividad: Actividad, alumnoId: number): boolean {
    if (
      actividad?.alumno_alto === alumnoId &&
      actividad.alumno_alto_evidencia !== null
    ) {
      return true;
    }

    if (
      actividad?.alumno_promedio === alumnoId &&
      actividad.alumno_promedio_evidencia !== null
    ) {
      return true;
    }

    if (
      actividad?.alumno_bajo === alumnoId &&
      actividad.alumno_bajo_evidencia !== null
    ) {
      return true;
    }

    return false;
  }

  downlaodFileEvidencia(actividad: Actividad, alumno: Alumno) {
    let file = '';

    if (actividad.alumno_alto === alumno.id) {
      file = actividad.alumno_alto_evidencia ?? '';
    }

    if (actividad.alumno_promedio === alumno.id) {
      file = actividad.alumno_promedio_evidencia ?? '';
    }

    if (actividad.alumno_bajo === alumno.id) {
      file = actividad.alumno_bajo_evidencia ?? '';
    }

    if (file === '') return;

    this.actividadService.descargarArchivo(file).subscribe((blob) => {
      const doc = document.createElement('a');
      doc.href = URL.createObjectURL(blob);
      doc.download = `${actividad.titulo} - ${alumno.matricula}`;
      doc.click();
    });
  }

  updateActividad(actividad: Actividad) {
    this.actividadSelected.set(actividad);
    this.showAddActivityModal.set(true);
  }

  downloadFileDescripcion(actividad: Actividad) {
    this.actividadService
      .descargarArchivo(actividad.descripcion)
      .subscribe((blob) => {
        const doc = document.createElement('a');
        doc.href = URL.createObjectURL(blob);
        doc.download = `${actividad.titulo} - Descripción`;
        doc.click();
      });
  }

  downloadFileFormato(actividad: Actividad) {
    this.actividadService
      .descargarArchivo(actividad.formato)
      .subscribe((blob) => {
        const doc = document.createElement('a');
        doc.href = URL.createObjectURL(blob);
        doc.download = `${actividad.titulo} - Formato`;
        doc.click();
      });
  }

  recargarComponente(): void {
    const currentUrl = this.router.url;

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
