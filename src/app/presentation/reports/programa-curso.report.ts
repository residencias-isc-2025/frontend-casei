import { ProgramaAsignatura } from '@core/models/programa-asaignatura.model';
import { createTable } from '@helpers/create-table.helper';
import { loadImageAsBase64 } from '@helpers/load-image-base64.helper';
import { DocHeaderData } from '@interfaces/reports/doc-header-data.interface';
import jsPDF from 'jspdf';
import { ObjetivoEspecifico } from '../../core/models/objetivo-especifico.model';
import { CellInput, RowInput } from 'jspdf-autotable';

export const programaCursoReport = async (
  doc: jsPDF,
  data: ProgramaAsignatura
): Promise<jsPDF> => {
  const logoBase64 = await loadImageAsBase64('/assets/images/cacei.png');

  console.log(data);

  const headerData: DocHeaderData = {
    claveCacei: 'P-CACEI-DAC-01-R01',
    numRevision: 1,
    fechaVigencia: '2025-01-01',
    logoCacei: logoBase64,
  };

  const fontSize = 7;

  let docStartY = 30;

  const objetivosEspecificosRows: RowInput[] = [];

  for (let i = 0; i < data.objetivos_especificos.length; i++) {
    const titleCell: CellInput = {
      content: `Específico ${i + 1}`,
      styles: {
        halign: 'left',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: data.objetivos_especificos[i].descripcion,
      colSpan: 7,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };

    const newRow = [titleCell, contentCell];

    objetivosEspecificosRows.push(newRow);
  }

  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content:
              'Cédula 2.1.1 - Programa del curso, asignatura o unidad de aprendizaje',
            colSpan: 9,
            styles: {
              halign: 'center',
              fontStyle: 'bolditalic',
              fillColor: [0, 0, 0],
              textColor: [255, 255, 255],
            },
          },
        ],
      ],
      theme: 'plain',
    },
    docStartY,
    headerData
  );

  docStartY = createTable(
    doc,
    {
      body: [
        [
          {
            content: 'INSTRUCCIONES:',
            styles: {
              halign: 'center',
              fontSize,
              fontStyle: 'bold',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content:
              'Utilice la siguiente cédula para aportar la información de los cursos, asignaturas o unidades de aprendizaje que integran el programa educativo. Se debe llenar sólo una cédula por cada curso previsto en plan de estudios.',
            styles: {
              halign: 'justify',
              fontStyle: 'normal',
              textColor: '#000',
              fontSize,
            },
          },
        ],
      ],

      theme: 'grid',
    },
    docStartY - 2,
    headerData
  );

  docStartY = createTable(
    doc,
    {
      body: [
        [
          {
            content: '1. Clave del curso',
            colSpan: 2,
            styles: {
              halign: 'left',
              fontSize,
              textColor: '#000',
              fontStyle: 'bold',
              fillColor: [200, 220, 255],
              cellWidth: 25,
            },
          },
          {
            content: data.materia?.clave,
            colSpan: 3,
            styles: {
              fontStyle: 'normal',
              fontSize,
              textColor: '#000',
            },
          },
          {
            content: '4. Ubicación (periodo en que se imparte)',
            colSpan: 3,
            styles: {
              halign: 'left',
              fontSize,
              fontStyle: 'bold',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: data.materia?.semestre,
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              textColor: '#000',
            },
          },
        ],
        [
          {
            content: '2. Nombre del curso',
            colSpan: 2,
            styles: {
              halign: 'left',
              fontSize,
              textColor: '#000',
              fontStyle: 'bold',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: data.materia?.nombre,
            colSpan: 8,
            styles: {
              fontSize,
              textColor: '#000',
            },
          },
        ],
        [
          {
            content: '3. Seriación o prerequisitos',
            colSpan: 2,
            styles: {
              halign: 'left',
              fontSize,
              textColor: '#000',
              fontStyle: 'bold',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: `Creditos requeridos: ${data.materia?.creditos_requeridos}; Materias Requeridas: ${data.materia?.materias_requeridas.length}`,
            colSpan: 8,
            styles: {
              fontSize,
              textColor: '#000',
            },
          },
        ],
        [
          {
            content: '5. Tipo de curso',
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Ejes',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'right',
              valign: 'middle',
              cellWidth: 20,
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Ciencias Básicas',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Ciencias de la Ingeniería',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Ingeniería Aplicada',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Diseño en Ingeniería',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'C. Sociales y Humanidades',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'C. Económ. Administrat.',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Otros Cursos',
            rowSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          {
            content: 'Obligatorio',
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Optativo',
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          {
            content: data.materia?.tipo_curso ? 'X' : '',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: !data.materia?.tipo_curso ? 'X' : '',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: '6. Horas totales',
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'right',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: data.materia?.horas_ciencias_basicas,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_ciencias_ingenieria,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_ingenieria_aplicada,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_disenio_ingenieril,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_ciencias_sociales,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_ciencias_economicas,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
          {
            content: data.materia?.horas_otros_cursos,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
            },
          },
        ],
        [
          {
            content: ['7. Objetivos del curso'],
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'left',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'General',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: data.materia?.objetivo_general,
            colSpan: 7,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'justify',
              textColor: '#000',
            },
          },
        ],
        [
          {
            content:
              'Principales resultados de aprendizaje (indicadores de los AE)',
            colSpan: 2,
            rowSpan: data.objetivos_especificos.length,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...objetivosEspecificosRows,
      ],

      theme: 'grid',
    },
    docStartY - 2,
    headerData
  );

  return doc;
};
