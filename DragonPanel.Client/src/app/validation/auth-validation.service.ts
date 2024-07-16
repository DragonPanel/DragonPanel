import { Injectable } from '@angular/core';
import { ValidationResult, ValidationResultBuilder } from './validation';

@Injectable({
  providedIn: 'root'
})
export class AuthValidationService {
  readonly #usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]$/;

  public validateCreateUserCredentials(username: string, password: string): ValidationResult {
    const builder = new ValidationResultBuilder();

    if (username.length > 24) {
      builder.addError(
        "username",
        $localize`Username cannot be longer than 24 characters.`,
        username
      );
    }

    if (this.#usernameRegex.test(username)) {
      builder.addError(
        "username",
        $localize`Username can contain only alfanumerical characters and userscores. Username can't start with number or underscore and can't end with underscore.`,
        username
      );
    }

    if (password.length < 8) {
      builder.addError(
        "password",
        $localize`Password must be at least 8 characters long.`,
        "<REDACTED>"
      );
    }

    return builder.build();
  }
}
