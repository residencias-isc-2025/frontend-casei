export const calculateSeniority = (startYear: string) => {
  const date = new Date();

  const year = parseInt(startYear, 10);
  const centuryPrefix = year === 0 || year >= 100 ? '20' : '19';
  const formattedYear = year.toString().padStart(2, '0');
  const seniority = `${centuryPrefix}${formattedYear}`;

  return `${seniority} - ${date.getFullYear()}`;
};
