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

export class PermissionNotFoundException extends DPException {
  constructor(permissionKey: string) {
    super(HttpStatus.NOT_FOUND, `Permission ${permissionKey} was not found.`);
  }
}

export class UserNotFoundException extends DPException {
  constructor(userIdentifier: any) {
    super(HttpStatus.NOT_FOUND, `User ${userIdentifier} was not found.`);
  }
}

export class RoleNotFoundException extends DPException {
  constructor(roleIdentifier: any) {
    super(HttpStatus.NOT_FOUND, `Role ${roleIdentifier} was not found.`);
  }
}

export class RoleOnUserNotFoundException extends DPException {
  constructor(roleIdentifier: any, userIndentifier: any) {
    super(HttpStatus.NOT_FOUND, `Role ${roleIdentifier} was not found on user ${userIndentifier}`);
  }
}

export class RoleAlreadyExistsException extends DPException {
  constructor(roleIdentifier: any) {
    super(HttpStatus.CONFLICT, `Role ${roleIdentifier} already exists.`);
  }
}

export class RoleAlreadyAssignedException extends DPException {
  constructor(roleIdentifier: any, userIdentifier: any) {
    super(HttpStatus.CONFLICT, `Role ${roleIdentifier} is already assigned to user ${userIdentifier}.`);
  }
}

export class PermissionNotFoundOnRoleException extends DPException {
  constructor(permissionKey: string, roleId: string) {
    super(HttpStatus.NOT_FOUND, `Permission ${permissionKey} was not foun on role ${roleId}`);
  }
}

export class ActionIsNotPartOfPermissionException extends DPException {
  constructor(permissionKey: string, action: string) {
    super(HttpStatus.BAD_REQUEST, `Action ${action} is not part of ${permissionKey} permission class.`);
  }
}
