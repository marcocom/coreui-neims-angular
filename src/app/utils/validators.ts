import { AbstractControl, ValidationErrors } from '@angular/forms';

import { dayjs } from '@app/utils/dayjs';

export class CustomValidators {
  public static dateRange(control: AbstractControl): ValidationErrors | null {
    if (!Array.isArray(control.value)) return null;

    if (
      control.value.length === 2 &&
      control.value.every((value) => dayjs(value).isValid())
    ) {
      return null;
    }

    return {
      dateRange: control.value,
    };
  }
}
