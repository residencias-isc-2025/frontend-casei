import { calculateAge } from '@helpers/calculate-age.helper';
import { calculateSeniority } from '@helpers/calculate-seniority.helper';
import { createTable } from '@helpers/create-table.helper';
import { formatedBirthdate } from '@helpers/formated-birthdate.helper';
import { getLastNomination } from '@helpers/get-last-nomination.helper';
import {
  ActualizacionDisciplinarResponse,
  AportacionesResponse,
  CapacitacionDocenteResponse,
  CurriculumVitaeReponse,
  DisenoIngenierilResponse,
  ExperienciaProfesionalResponse,
  FormacionAcademicaData,
  GestionAcademicaResponse,
  InstitucionesResponse,
  LogrosPrefesionalesResponse,
  ParticipacionResponse,
  PremiosResponse,
  ProductosAcademicosResponse,
} from '@interfaces/index';
import jsPDF from 'jspdf';

export const curriculumVitaeReport = (
  doc: jsPDF,
  data: CurriculumVitaeReponse,
  schools: InstitucionesResponse[]
): jsPDF => {
  const payrollNumber = !isNaN(Number(data.usuario.username))
    ? data.usuario.username
    : '000102';

  let docStartY = 25;

  // Título
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: 'Cédula 0 - Currículum Vitae Resumido',
            styles: {
              halign: 'center',
              fontStyle: 'italic',
              fillColor: [0, 0, 0],
              textColor: [255, 255, 255],
            },
          },
        ],
      ],
      theme: 'plain',
    },
    docStartY
  );

  // 1.- Número de profesor
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content:
              'IMPORTANTE: El CV debe limitarse a una extensión máxima de tres cuartillas. No se aceptarán documentos adicionales.',
            styles: { halign: 'left', fontStyle: 'normal' },
          },
          {
            content: '1. Número de profesor\n(de 001 a 999)',
            styles: {
              halign: 'center',
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
            },
          },
          {
            content: `Año: ${payrollNumber.substring(
              0,
              2
            )}\nmes: ${payrollNumber.substring(
              2,
              4
            )}\nnúmero: ${payrollNumber.substring(4, 7)}`,
            styles: { halign: 'left' },
          },
        ],
      ],
      theme: 'grid',
    },
    docStartY
  );

  // 2.- Nombre del profesor
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '2. Nombre del profesor',
            colSpan: 3,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Apellido paterno',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Apellido materno',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Nombre(s)',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: [
        [
          data.usuario.apellido_paterno,
          data.usuario.apellido_materno,
          data.usuario.nombre,
        ],
      ],
      theme: 'grid',
    },
    docStartY
  );

  // 3.- Datos básicos
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '3. Datos básicos',
            colSpan: 4,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Edad',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Fecha de nacimiento',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Nombramiento actual',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Antigüedad',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: [
        [
          calculateAge(data.usuario.fecha_nacimiento!),
          formatedBirthdate(data.usuario.fecha_nacimiento!),
          getLastNomination(data.gestion_academica),
          calculateSeniority(payrollNumber.substring(0, 2)),
        ],
      ],
      theme: 'grid',
    },
    docStartY
  );

  // 4.- Formación ácademica
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '4. Formación académica',
            colSpan: 5,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Nivel',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Nombre',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Institución y país',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Año de obtención',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Cédula Profesional',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.formacion_academica.map((item: FormacionAcademicaData) => [
        item.nivel,
        item.nombre,
        schools.find((i) => i.id === item.institucion_pais)
          ?.nombre_institucion!,
        item.anio_obtencion,
        item.cedula_profesional,
      ]),
      theme: 'grid',
    },
    docStartY
  );

  // 5.- Capacitación docente
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '5. Capacitación docente',
            colSpan: 4,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Tipo de capacitación',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Institución y país',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Año de obtención',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Horas',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.capacitacion_docente.map(
        (item: CapacitacionDocenteResponse) => [
          item.tipo_capacitacion,
          schools.find((i) => i.id === item.institucion_pais)
            ?.nombre_institucion!,
          item.anio_obtencion,
          item.horas,
        ]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 6.- Actualización disciplinar
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '6. Actualización disciplinar',
            colSpan: 4,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Tipo de actualización',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Institución y país',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Año de obtención',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Horas',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.actualizacion_disciplinaria.map(
        (item: ActualizacionDisciplinarResponse) => [
          item.tipo_actualizacion,
          schools.find((i) => i.id === item.institucion_pais)
            ?.nombre_institucion!,
          item.anio_obtencion,
          item.horas,
        ]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 7.- Gestión académica
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '7. Gestión académica',
            colSpan: 4,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Actividad o puesto',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Institución',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Desde',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Hasta',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.gestion_academica.map((item: GestionAcademicaResponse) => [
        item.actividad_puesto,
        schools.find((i) => i.id === item.institucion_pais)
          ?.nombre_institucion!,
        String(item.d_mes_anio),
        String(item.a_mes_anio),
      ]),
      theme: 'grid',
    },
    docStartY
  );

  // 8. Productos académicos relevantes
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content:
              '8. Productos académicos relevantes en los últimos cinco (5) años, relacionados con el PE',
            colSpan: 2,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Núm',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Descripción del producto académico',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.productos_academicos_relevantes.map(
        (item: ProductosAcademicosResponse, index) => [
          index + 1,
          item.descripcion_producto_academico,
        ]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 9.- Experiencia profesional no académica
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '9. Experiencia profesional no académica',
            colSpan: 4,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Actividad o puesto',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Organización o empresa',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Desde',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Hasta',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.experiencia_no_academica.map(
        (item: ExperienciaProfesionalResponse) => [
          item.actividad_puesto,
          item.organizacion_empresa,
          String(item.d_mes_anio),
          String(item.a_mes_anio),
        ]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 10.- Experiencia en diseño ingenieril
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '10. Experiencia en diseño ingenieril',
            colSpan: 3,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Organismo',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Periodo (Años)',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Nivel de experiencia',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.experiencia_diseno_ingenieril.map(
        (item: DisenoIngenierilResponse) => [
          item.organismo,
          item.periodo,
          item.nivel_experiencia,
        ]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 11.- Logros profesionales
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content:
              '11. Productos académicos relevantes en los últimos cinco (5) años, relacionados con el PE',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Descripción de cada logro',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.logros_profesionales.map(
        (item: LogrosPrefesionalesResponse) => [item.descripcion]
      ),
      theme: 'grid',
    },
    docStartY
  );

  // 12.- Participación en asociaciones
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content:
              '12. Participación en colegios, cámaras, asociaciones científicas o algún otro tipo de organismo profesional',
            colSpan: 3,
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Organismo',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Periodo (Años)',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
          {
            content: 'Nivel de participación',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.participacion.map((item: ParticipacionResponse) => [
        item.organismo,
        item.periodo,
        item.nivel_p,
      ]),
      theme: 'grid',
    },
    docStartY
  );

  // 13.- Premios
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '13. Premios, distinciones o reconocimientos recibidos',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
        [
          {
            content: 'Descripción del premio o reconocimiento',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'normal',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.premios.map((item: PremiosResponse) => [item.descripcion]),
      theme: 'grid',
    },
    docStartY
  );

  // 14.- Aportaciones
  docStartY = createTable(
    doc,
    {
      head: [
        [
          {
            content: '14. Aportaciones relevantes a la mejora del PE',
            styles: {
              fillColor: [200, 220, 255],
              fontStyle: 'bold',
              halign: 'left',
            },
          },
        ],
      ],
      body: data.aportaciones.map((item: AportacionesResponse) => [
        item.descripcion,
      ]),
      theme: 'grid',
    },
    docStartY
  );

  return doc;
};
