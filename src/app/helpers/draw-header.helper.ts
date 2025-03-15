import jsPDF from 'jspdf';
import { formatedBirthdate } from './formated-birthdate.helper';
import { DocHeaderData } from '@interfaces/reports/doc-header-data.interface';

let lastPageNumber = -1;

/**
 * Dibuja el encabezado en cada página del PDF
 * @param doc La instacia del jsPDF
 * @param pageNumber El número de página
 */

export const drawHeader = (
  doc: jsPDF,
  pageNumber: number,
  headerData: DocHeaderData
) => {
  if (lastPageNumber === pageNumber) return;

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 86, 86);
  doc.text(headerData.claveCacei, pageWidth - 10, 15, { align: 'right' });

  doc.text(`Revisión: ${headerData.numRevision}`, pageWidth - 10, 20, {
    align: 'right',
  });
  doc.text(
    `Vigente a partir del ${formatedBirthdate(headerData.fechaVigencia)}`,
    pageWidth - 10,
    25,
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
