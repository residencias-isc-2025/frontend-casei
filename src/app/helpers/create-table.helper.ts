import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { drawHeader } from './draw-header.helper';
import { DocHeaderData } from '@interfaces/reports/doc-header-data.interface';

export const createTable = (
  doc: jsPDF,
  options: UserOptions,
  docStartY: number,
  headerData: DocHeaderData
): number => {
  autoTable(doc, {
    ...options,
    margin: { top: 30 },
    startY: docStartY,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
    didDrawPage: () => {
      const pageNumber = doc.internal.pages.length - 1;
      drawHeader(doc, pageNumber, headerData);
    },
  });
  return (doc as any).lastAutoTable.finalY + 3;
};
