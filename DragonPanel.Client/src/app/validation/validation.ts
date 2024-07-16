export interface ISuccessValidationResult {
  success: true,
}

export interface IFailedValidationResult {
  success: false,
  errors: IValidationError[],
}

export type ValidationResult = ISuccessValidationResult | IFailedValidationResult;

export interface IValidationError {
  property: string,
  value: any,
  description: string,
}

export class ValidationException extends Error {
  constructor(validationResult: IFailedValidationResult) {
    super($localize`Validation failed for some elements.`);
    this.name = this.constructor.name;
    this.result = validationResult;
  }

  result: IFailedValidationResult;

  /**
   * Formats validation errors to nice string array, each element represent one error
   * and is in format: <property>: <description>
   */
  format(): string[] {
    return formatValidationErrors(this.result.errors);
  }
}

export class ValidationResultBuilder {
  #success: boolean = true;
  #errors: IValidationError[] = [];
  #builded = false;

  addError(property: string, description: string, value?: any) {
    this.#success = false;
    this.#errors.push({ property, description, value });
  }

  build(): ValidationResult {
    if (this.#builded) {
      throw new Error("Already builded validation result.");
    }
    this.#builded = true;

    if (this.#success) {
      return { success: true };
    }
    return {
      success: false,
      errors: this.#errors
    }
  }
}

/**
 * Formats validation errors to nice string array, each element represent one error
 * and is in format: <property>: <description>
 * @param validationErrors
 */
export function formatValidationErrors(validationErrors: IValidationError[]): string[] {
  return validationErrors.map(err => `${err.property}: ${err.description}`);
}

/**
 * Checks if validation was successful, in case of failure throws ValidationException.
 * @param result
 */
export function assertValidationSuccess(result: ValidationResult) {
  if (!result.success) {
    throw new ValidationException(result);
  }
}
