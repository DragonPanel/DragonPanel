import { Permission } from "../decorators/permission.decorator";

@Permission("net.dragonpanel.authorization.listPermissions")
export default class ListPermissionsPermission {
  static readonly Description = "Allows to list permission classes.";
  static readonly Name = "List permissions"
}
