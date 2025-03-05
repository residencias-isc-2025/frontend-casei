import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import { formatedBirthdate } from './formated-birthdate.helper';

let lastPageNumber = -1;

/**
 * Dibuja el encabezado en cada página del PDF
 * @param doc La instacia del jsPDF
 * @param pageNumber El número de página
 */

export const drawHeader = (doc: jsPDF, pageNumber: number) => {
  if (lastPageNumber === pageNumber) return;

  console.log('CAMBIO DE PÁGINA');

  const pageWidth = doc.internal.pageSize.getWidth();
  const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 86, 86);
  doc.text('Revisión: 2', pageWidth - 10, 15, { align: 'right' });
  doc.text(
    `Vigente a partir del ${formatedBirthdate(date)}`,
    pageWidth - 10,
    20,
    {
      align: 'right',
    }
  );

  doc.text(
    `${pageNumber}`,
    pageWidth - 10,
    doc.internal.pageSize.getHeight() - 5,
    {
      align: 'right',
    }
  );

  lastPageNumber = pageNumber;
};
