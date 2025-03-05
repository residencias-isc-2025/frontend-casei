import { Injectable } from '@angular/core';
//import jsPDF from 'jspdf';
import {
  CurriculumVitaeReponse,
  InstitucionesResponse,
} from '@interfaces/index';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  generateCurriculumVitae(
    data: CurriculumVitaeReponse,
    schools: InstitucionesResponse[]
  ) {
    //const doc = new jsPDF();
    const payrollNumber = !isNaN(Number(data.usuario.username)) ? data.usuario.username : '000102';
    //const pageWidth = doc.internal.pageSize.getWidth();


  }
}
