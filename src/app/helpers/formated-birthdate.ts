export const formatedBirthdate = (birthDate: string) => {
  const [year, month, day] = birthDate.split('-').map(Number);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return `${day} de ${months[month - 1]} de ${year}`;
};
