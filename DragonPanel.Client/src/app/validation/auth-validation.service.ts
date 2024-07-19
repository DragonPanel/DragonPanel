import { Injectable } from '@angular/core';
import { IValidationError, ValidationErrors } from './validation';

@Injectable({
  providedIn: 'root'
})
export class AuthValidationService {
  // TODO: tbh I should fetch those from the server
  // Server should be the only source for username and password constrains.
  public readonly usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]?$/;
  public readonly usernameLen = [3, 24];
  public readonly passwordLen = 8;

  public validateCreateUserCredentials(username: string, password: string): IValidationError[] {
    const usernameRes = this.validateUsername(username)
    const passwordRes = this.validatePassword(password);
    return [ ...usernameRes, ...passwordRes ];
  }

  public validatePassword(password: string) {
    const errors = new ValidationErrors();

    if (password.length < this.passwordLen) {
      errors.add(
        "password",
        $localize`Password must be at least ${this.passwordLen} characters long.`,
        "<REDACTED>"
      );
    }

    return errors.errors;
  }

  public validateUsername(username: string): IValidationError[] {
    const errors = new ValidationErrors();

    if (username.length < this.usernameLen[0] || username.length > this.usernameLen[1]) {
      const adj = username.length < this.usernameLen[0] ? "shorter" : "longer";
      const chars = username.length < this.usernameLen[0] ? this.usernameLen[0] : this.usernameLen[1];

      errors.add(
        "username",
        $localize`Username cannot be ${adj} than ${chars} characters.`,
        username
      );
    }

    if (!this.usernameRegex.test(username)) {
      errors.add(
        "username",
        $localize`Username can contain only alfanumerical characters and userscores. Username can't start with number or underscore and can't end with underscore.`,
        username
      );
    }

    return errors.errors;
  }
}
