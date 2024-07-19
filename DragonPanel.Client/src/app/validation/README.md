# Validation

My custom logic for validation, the rules are simple:
- Each method that performs validation returns an array of `IValidationError`. If returned array is empty then validation was successful.
- Directory `validators` contains validators for Angular's reactive forms:
  * Each validator function should have `key` property, which should be created using `validationErrorKeyOf(validator: (...args: any[]) => ValidatorFn)` function.
  * Each validator function should convert error to Angular's format by using `mapValidationErrorsToNg(key: string, errors: IValidationError[])`
  * `validationErrorKeyOf` prefixes error keys with `sg_`, thanks that it's easy to determine if error comes from my validators.
  * Angular's validation errors' value set by `mapValidationErrorToNg` will always be `IValidationError[]`.

## Example of validator
```ts
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
```

## Example of validation function
```ts
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/;

function validateUsername(username: string): IValidationError[] {
  const errors = new ValidationErrors();

  if (username.length > 16) {
    errors.add(
      "username",
      $localize`Username cannot be longer than 16 characters.`,
      username
    );
  }

  if (!usernameRegex.test(username)) {
    errors.add(
      "username",
      $localize`Username can contain only alfanumerical characters and userscores. Username can't start with number or underscore and can't end with underscore.`,
      username
    );
  }

  return errors.errors;
}
```
