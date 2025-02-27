import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validYearValidator(
  control: AbstractControl
): ValidationErrors | null {
  const currentYear = new Date().getFullYear();
  const year = Number(control.value);

  if (!year || isNaN(year) || year > currentYear || year < 1900) {
    return { invalidYear: true };
  }

  return null;
}
