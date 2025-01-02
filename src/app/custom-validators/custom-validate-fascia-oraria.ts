import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FasciaOrariaValidator {
  static validFasciaOraria(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get('start')?.value;
      const end = formGroup.get('end')?.value;

      if (!start || !end) {
        return null;
      }

      const startTime = this.convertTimeToMinutes(start);
      const endTime = this.convertTimeToMinutes(end);

      if (startTime >= endTime) {
        return { invalidTimeRange: true };
      }

      if (endTime - startTime < 60) {
        return { timeTooShort: true };
      }

      return null;
    };
  }

  private static convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
