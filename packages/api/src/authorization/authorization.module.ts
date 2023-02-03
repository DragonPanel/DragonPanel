import { Logger, Module } from '@nestjs/common';
import { DECORATED_PERMISSION_KEY, PERMISSION_KEY_KEY } from './decorators/permission.decorator';
import { IPermissionClass } from './permission-class';
import { PERMISSIONS_STORE } from './permissions.store';
import { UserAuthorizationService } from './services/user-authorization.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationController } from './authorization.controller';
import PermissionPermission from './permissions/permission.permission';

const logger = new Logger("AuthorizationModule");

@Module({
  providers: [UserAuthorizationService, AuthorizationService],
  exports: [UserAuthorizationService],
  controllers: [AuthorizationController]
})
export class AuthorizationModule {
  static forRoot() {
    return this.withPermissions([PermissionPermission]);
  }

  static withPermissions(permissions: IPermissionClass[]) {
    permissions.forEach(permission => {
      if (!Reflect.hasMetadata(DECORATED_PERMISSION_KEY, permission)) {
        this.errorOnNotDecoratedPermission(permission);
        return; // Return for sanity
      }

      const permissionKey = Reflect.getMetadata(PERMISSION_KEY_KEY, permission);
      if (PERMISSIONS_STORE.has(permissionKey)) {
        this.duplicatePermissionError(permissionKey);
      }
      else {
        // Else for sanity aswell XD
        PERMISSIONS_STORE.set(permissionKey, permission);
      }
    });

    return AuthorizationModule;
  }

  private static errorOnNotDecoratedPermission(perm: IPermissionClass) {
    logger.error(`Permission ${perm.name} is not decorated by @Permission decorator.`);
    logger.error(`Only classes decorated with @Permission decorator are considered valid.`);

    // I coded too much in Rust I guess.
    let solution = `Solution:\n`;
    solution += `\t@Permission()\n`;
    solution += `\t^^^^^^^^^^^^^\n`;
    solution += `\texport class ${perm.name} {`;
    logger.log(solution);
    throw new Error(`Permission ${perm.name} is not decorated by @Permission decorator.`);
  }

  private static duplicatePermissionError(permKey: string) {
    logger.error(`Permission ${permKey} already exists! Permission keys MUST be ALWAYS unique.`);
    throw new Error(`Permission ${permKey} already exists.`)
  }
}
