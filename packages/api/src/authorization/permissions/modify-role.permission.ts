import { Permission } from "../decorators/permission.decorator";

@Permission("net.dragonpanel.authorization.modifyRole")
export default class ModifyRolePermission {
  static readonly Description = "Allows to modify role, change it's name, add or remove permissions";
  static readonly Name = "Modify role";
}
