import { Permission } from "src/authorization/decorators/permission.decorator";

@Permission()
export default class UnitPermission {
  static Action = {
    List: "list",
    Load: "load",
    Start: "start",
    Stop: "stop",
    Restart: "restart"
  }
}
