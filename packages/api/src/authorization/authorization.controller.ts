import { Controller, Get } from '@nestjs/common';
import ListPermissionsPermission from './permissions/list-permissions.permission';
import PermissionPermission from './permissions/list-permissions.permission';
import { AuthorizationService } from './services/authorization.service';
import { UserAuthorizationService } from './services/user-authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(
    private authorizationService: AuthorizationService,
    private userAuth: UserAuthorizationService
  ) {}

  @Get("classes")
  async listClasses() {
    await this.userAuth.must(ListPermissionsPermission);
    return this.authorizationService.listPermissionClasses();
  }
}
