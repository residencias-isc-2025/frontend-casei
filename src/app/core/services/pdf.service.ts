import { inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { curriculumVitaeReport } from '@presentation/reports/curriculum-vitae.report';
import { ToastService } from './toast.service';
import { curriculumSinteticoReport } from '@presentation/reports/curriculum-sintetico.report';
import { Institucion } from '@core/models/institucion.model';
import { CurriculumVitae } from '@core/models/curriculum-vitae.model';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  toastService = inject(ToastService);

  generarCurriculumVitae(data: CurriculumVitae, schools: Institucion[]) {
    const { apellido_materno, apellido_paterno, nombre, fecha_nacimiento } =
      data.usuario;

    if (
      !apellido_materno ||
      !apellido_paterno ||
      !nombre ||
      !fecha_nacimiento
    ) {
      let missingFields = [];

      if (apellido_materno) missingFields.push('Apellido materno');
      if (apellido_paterno) missingFields.push('Apellido paterno');
      if (nombre) missingFields.push('Nombre');
      if (fecha_nacimiento) missingFields.push('Fecha de nacimiento');

      this.toastService.showWarning(
        `Falta información básica: ${missingFields.join(', ')}`,
        'Completa los campos obligatorios'
      );

      return;
    }

    let doc = new jsPDF();

    doc = curriculumVitaeReport(doc, data, schools);

    doc.save('CACEI - Cedula_0');
  }

  generarCurriculumSintetico(data: CurriculumVitae, schools: Institucion[]) {
    const { apellido_materno, apellido_paterno, nombre, fecha_nacimiento } =
      data.usuario;

    if (
      !apellido_materno ||
      !apellido_paterno ||
      !nombre ||
      !fecha_nacimiento
    ) {
      let missingFields = [];

      if (apellido_materno) missingFields.push('Apellido materno');
      if (apellido_paterno) missingFields.push('Apellido paterno');
      if (nombre) missingFields.push('Nombre');
      if (fecha_nacimiento) missingFields.push('Fecha de nacimiento');

      this.toastService.showWarning(
        `Falta información básica: ${missingFields.join(', ')}`,
        'Completa los campos obligatorios'
      );

      return;
    }

    let doc = new jsPDF();

    doc = curriculumSinteticoReport(doc, data, schools);

    doc.save('CACEI - Cedula_5_1_0 - CV Sintético');
  }
}
