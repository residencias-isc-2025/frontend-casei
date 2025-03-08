import { GestionAcademicaData } from '@interfaces/index';

export const getLastNomination = (
  gestionAcademica: GestionAcademicaData[]
): string => {
  // Ordenar por la fecha 'd_mes_anio' de más reciente a más antiguo
  const sortedGestionAcademica = gestionAcademica.sort((a, b) => {
    const dateA = new Date(a.d_mes_anio).getTime();
    const dateB = new Date(b.d_mes_anio).getTime();
    return dateB - dateA; // Orden descendente
  });

  const lastActivity =
    sortedGestionAcademica[0]?.actividad_puesto || 'Sin datos';

  return lastActivity;
};
