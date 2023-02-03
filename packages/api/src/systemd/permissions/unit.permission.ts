import { Permission } from "src/authorization/decorators/permission.decorator";

@Permission("net.dragonpanel.systemd.unitPermission")
export default class UnitPermission {
  static Action = {
    List: "list",
    Load: "load",
    Start: "start",
    Stop: "stop",
    Restart: "restart"
  }

  static Description = "Permission for systemd units."
}
