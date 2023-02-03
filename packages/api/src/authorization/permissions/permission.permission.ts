import { Permission } from "../decorators/permission.decorator";

@Permission("net.dragonpanel.authorization.permission")
export default class PermissionPermission {
  static Action = {
    List: "list",
    Grant: "grant"
  }

  static Description = "Permission for managing... well... permissions xD"
}
