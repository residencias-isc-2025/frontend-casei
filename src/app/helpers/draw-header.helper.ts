import jsPDF from 'jspdf';
import { formatedBirthdate } from './formated-birthdate.helper';
import { DocHeaderData } from '@interfaces/reports/doc-header-data.interface';
import { loadImageAsBase64 } from './load-image-base64.helper';

let lastPageNumber = -1;

export const drawHeader = async (
  doc: jsPDF,
  pageNumber: number,
  headerData: DocHeaderData
) => {
  if (lastPageNumber === pageNumber) return;

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 86, 86);

  if (headerData.logoCacei) {
    try {
      doc.addImage(headerData.logoCacei, 'PNG', 10, 10, 30, 15);
    } catch (err) {
      console.warn('Error insertando logo:', err);
    }
  }

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
