import { HttpException, HttpStatus } from "@nestjs/common";

export interface DPExceptionOptions {
  details?: { [key: string]: any },
  cause?: Error | undefined;
}

export class DPException extends HttpException {
  constructor(
    status: number,
    message: string,
    options?: DPExceptionOptions
  ) {
    const { cause, details } = options ?? {};
    const errorData = {
      ...(details ?? {}),
      status,
      message,
      error: ""
    }
    
    super(errorData, status, { cause })
    
    errorData.error = this.name;
  }
}

export class UserAlreadyExistsException extends DPException {
  constructor(username: string) {
    super(HttpStatus.CONFLICT, `User ${username} already exists.`)
  }
}

export class InvalidCredentialsException extends DPException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
  }
}

export class AdminAlreadyExistException extends DPException {
  constructor() {
    super(HttpStatus.FORBIDDEN, "Admin already exists.")
  }
}

export class NoPermissionException extends DPException {
  constructor() {
    super(HttpStatus.FORBIDDEN, "User has no permissions to perform requested action.");
  }
}
