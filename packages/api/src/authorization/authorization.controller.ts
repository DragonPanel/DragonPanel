import { Controller, Get } from '@nestjs/common';
import PermissionPermission from './permissions/permission.permission';
import { AuthorizationService } from './services/authorization.service';
import { UserAuthorizationService } from './services/user-authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(
    private authorizationService: AuthorizationService,
    private userAuth: UserAuthorizationService
  ) {}

  @Get("classes")
  listClasses() {
    // TODO: this.userAuth.must(PermissionPermission.Action.List);
    return this.authorizationService.listPermissionClasses();
  }
}
