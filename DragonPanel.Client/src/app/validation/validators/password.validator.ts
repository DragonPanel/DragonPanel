import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AuthValidationService } from "../auth-validation.service";
import { mapValidationErrorsToNg, validationErrorKeyOf } from "../validation";

export function passwordValidator(): ValidatorFn {
  const authValidationService = inject(AuthValidationService);

  return (control: AbstractControl): ValidationErrors | null => {
    const errors = authValidationService.validatePassword(control.value);
    return mapValidationErrorsToNg(passwordValidator.key, errors);
  }
}

passwordValidator.key = validationErrorKeyOf(passwordValidator);
