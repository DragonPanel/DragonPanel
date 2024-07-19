import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { AuthValidationService } from "../auth-validation.service";
import { mapValidationErrorsToNg, validationErrorKeyOf } from "../validation";

export function usernameValidator(): ValidatorFn {
  const authValidationService = inject(AuthValidationService);

  return (control: AbstractControl): ValidationErrors | null => {
    const errors = authValidationService.validateUsername(control.value);
    return mapValidationErrorsToNg(usernameValidator.key, errors);
  }
}

usernameValidator.key = validationErrorKeyOf(usernameValidator);
