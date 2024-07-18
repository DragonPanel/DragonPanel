export interface IValidationError {
  property: string,
  value: any,
  description: string,
}

/**
 * Helper class for little more convienient validation error adding.
 */
export class ValidationErrors {
  errors: IValidationError[] = [];
  add(property: string, description: string, value?: any) {
    this.errors.push({
      property, description, value
    });
  }
}

export class ValidationException extends Error {
  constructor(validationResult: IValidationError[]) {
    super($localize`Validation failed for some elements.`);

    if (validationResult.length === 0) {
      console.warn("Warning, ValidationException has been created with 0 validation errors.");
    }

    this.name = this.constructor.name;
    this.errors = validationResult;
  }

  errors: IValidationError[];

  /**
   * Formats validation errors to nice string array, each element represent one error
   * and is in format: <property>: <description>
   */
  format(): string[] {
    return formatValidationErrors(this.errors);
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
export function assertValidationSuccess(result: IValidationError[]) {
  if (result && result.length > 0) {
    throw new ValidationException(result);
  }
}
