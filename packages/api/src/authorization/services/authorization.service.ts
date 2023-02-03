import { Injectable } from '@nestjs/common';
import { IPermissionClassDto } from '../dto/permission-class.dto';
import { PERMISSIONS_STORE } from '../permissions.store';

@Injectable()
export class AuthorizationService {
  listPermissionClasses(): IPermissionClassDto[] {
    return Array.from(PERMISSIONS_STORE.entries())
      .map(([key, permission]) => ({
        name: permission.name,
        key,
        description: permission.Description,
        actions: Object.keys(permission.Action)
      }));
  }
}
