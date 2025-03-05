export const calculateAge = (birthDate: string) => {
  const today = new Date();
  const date = new Date(birthDate);

  let age = today.getFullYear() - date.getFullYear();
  const month = today.getMonth() - date.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < date.getDate())) age--;

  return age;
};
