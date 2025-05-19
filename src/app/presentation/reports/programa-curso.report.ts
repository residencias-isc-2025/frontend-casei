import { ProgramaAsignatura } from '@core/models/programa-asaignatura.model';
import { createTable } from '@helpers/create-table.helper';
import { loadImageAsBase64 } from '@helpers/load-image-base64.helper';
import { DocHeaderData } from '@interfaces/reports/doc-header-data.interface';
import jsPDF from 'jspdf';
import { CellInput, RowInput } from 'jspdf-autotable';

export const programaCursoReport = async (
  doc: jsPDF,
  data: ProgramaAsignatura
): Promise<jsPDF> => {
  const logoBase64 = await loadImageAsBase64('/assets/images/cacei.png');

  const headerData: DocHeaderData = {
    claveCacei: 'P-CACEI-DAC-01-R01',
    numRevision: 1,
    fechaVigencia: '2025-01-01',
    logoCacei: logoBase64,
  };

  const fontSize = 7;

  let docStartY = 30;

  const objetivosEspecificosCells: CellInput[] = [];
  const objetivosEspecificosRows: RowInput[] = [];

  const atributosEgresoRows: RowInput[] = [];
  const temasRows: RowInput[] = [];
  const estrategiasEnsenanza: RowInput[] = [];
  const estrategiasEvaluacion: RowInput[] = [];
  const practicasRows: RowInput[] = [];
  const bibliografiasRows: RowInput[] = [];

  let currentRow: CellInput[] = [];

  for (const [i, objetivo_espefico] of data.objetivos_especificos.entries()) {
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
      content: objetivo_espefico.descripcion,
      colSpan: 7,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };

    if (i === 0) {
      objetivosEspecificosCells.push(titleCell, contentCell);
    } else {
      objetivosEspecificosRows.push([titleCell, contentCell]);
    }
  }

  for (const [i, atributoEgreso] of data.atributos_egreso.entries()) {
    const titleCell: CellInput = {
      content: `AE ${i + 1} del PE\n${atributoEgreso.descripcion}`,
      colSpan: 2,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
      },
    };

    currentRow.push(titleCell);

    if ((i + 1) % 5 === 0 || i === data.atributos_egreso.length - 1) {
      atributosEgresoRows.push([...currentRow]);
      currentRow = [];
    }
  }

  for (const [i, tema] of data.temas.entries()) {
    const indexCell: CellInput = {
      content: `${i + 1}`,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: tema.nombre,
      colSpan: 8,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };
    temasRows.push([indexCell, contentCell]);
  }

  for (const [i, etrategiaEnsenanza] of data.estrategias_ensenanza.entries()) {
    const indexCell: CellInput = {
      content: `${i + 1}`,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: etrategiaEnsenanza.descripcion,
      colSpan: 8,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };
    estrategiasEnsenanza.push([indexCell, contentCell]);
  }

  for (const [
    i,
    estrategiaEvaluacion,
  ] of data.estrategias_evaluacion.entries()) {
    const indexCell: CellInput = {
      content: `${i + 1}`,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: estrategiaEvaluacion.descripcion,
      colSpan: 8,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };
    estrategiasEvaluacion.push([indexCell, contentCell]);
  }

  for (const [i, practica] of data.practicas.entries()) {
    const indexCell: CellInput = {
      content: `${i + 1}`,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: practica.descripcion,
      colSpan: 8,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };
    practicasRows.push([indexCell, contentCell]);
  }

  for (const [i, bibliografia] of data.bibliografias.entries()) {
    const indexCell: CellInput = {
      content: `${i + 1}`,
      styles: {
        halign: 'center',
        fontSize,
        textColor: '#000',
        fontStyle: 'normal',
        fillColor: [200, 220, 255],
      },
    };

    const contentCell: CellInput = {
      content: `${bibliografia.autor}, ${bibliografia.nombre}, ${bibliografia.tipo}, ${bibliografia.anio}`,
      colSpan: 8,
      styles: {
        fontStyle: 'normal',
        fontSize,
        textColor: '#000',
      },
    };
    bibliografiasRows.push([indexCell, contentCell]);
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
          objetivosEspecificosCells[0],
          objetivosEspecificosCells[1],
        ],
        ...objetivosEspecificosRows,
        [
          {
            content:
              '8. Aportaciones del curso a los atributos de egreso del PE',
            colSpan: 10,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          {
            content:
              'Indicar el nivel de aportación: I = Introductorio; M = Medio; A = Avanzado',
            colSpan: 10,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...atributosEgresoRows,
        [
          {
            content: '9. Datos relevantes del curso',
            colSpan: 1,
            rowSpan: 3,
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
            content: '9.a Horas a la semana',
            colSpan: 1,
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
            content: '9.b Horas semanales por tipo',
            colSpan: 3,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: '9.c Número de grupos o secciones',
            colSpan: 1,
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
            content: '9.d Calificación',
            colSpan: 1,
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
            content: '9.e Resultados cuantitativos',
            colSpan: 3,
            styles: {
              fontStyle: 'bold',
              fontSize,
              halign: 'center',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          {
            content: 'Aula',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Laboratorio y talleres.',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Prácticas externas, campo, etc.',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content:
              'Porcentaje de alumnos que igualan o superan calificación promedio',
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Porcentaje de reprobación',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          { content: '0' },
          { content: '0' },
          { content: '0' },
          { content: '0' },
          { content: '0' },
          { content: '0', colSpan: 2 },
          { content: '0' },
          { content: '0' },
        ],
        [
          {
            content: '10. Contenido sintético del curso',
            rowSpan: data.temas.length + 1,
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
            content: 'Principales unidades temáticas',
            colSpan: 9,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...temasRows,
        [
          {
            content: '11. Principales estrategias de enseñanza',
            rowSpan: data.estrategias_ensenanza.length + 1,
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
            content: 'Principales métodos, técnicas y ambientes de aprendizaje',
            colSpan: 9,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...estrategiasEnsenanza,
        [
          {
            content: '12. Principales estrategias de evaluación',
            rowSpan: data.estrategias_evaluacion.length + 1,
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
            content:
              'Principales métodos, técnicas e instrimentos de evaluación del aprendizaje',
            colSpan: 9,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...estrategiasEvaluacion,
        [
          {
            content: '13. Prácticas',
            rowSpan: data.practicas.length + 1,
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
            content:
              'Principales prácticas de laboratorio / cómputo / campo / otro',
            colSpan: 9,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...practicasRows,
        [
          {
            content: '14. Bibliografía',
            rowSpan: data.bibliografias.length + 1,
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
            content:
              'Datos relevantes de texto(s) obligatorio(s): autor, titulo, editorial y año de publicación. No bibliografía completa.',
            colSpan: 9,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'center',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        ...bibliografiasRows,
        [
          {
            content: '15. Profesores',
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
            content: 'Número',
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Nombres',
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Apellido(s)',
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Grado Acad.',
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
          {
            content: 'Exp. Prof.',
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              fontSize,
              halign: 'left',
              valign: 'middle',
              textColor: '#000',
              fillColor: [200, 220, 255],
            },
          },
        ],
        [
          {
            content: '15.a Profesor(es) responsable(s)',
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
            content: '15.b Otros instructores (últimos dos años)',
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
      ],

      theme: 'grid',
    },
    docStartY - 2,
    headerData
  );

  return doc;
};
