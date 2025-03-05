import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

import {
  CurriculumVitaeReponse,
  InstitucionesResponse,
} from '@interfaces/index';
import { curriculumVitaeReport } from '@presentation/reports/curriculum-vitae.report';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  generateCurriculumVitae(
    data: CurriculumVitaeReponse,
    schools: InstitucionesResponse[]
  ) {
    let doc = new jsPDF();

    doc = curriculumVitaeReport(doc, data, schools);

    doc.save('CACEI - Cedula_0');
  }
}
