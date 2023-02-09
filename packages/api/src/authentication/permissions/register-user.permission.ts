import { Permission } from "src/authorization/decorators/permission.decorator";

@Permission("net.dragonpanel.authentication.registerUser")
export class RegisterUserPermission {
  static Name = "Register User";
  static Description = "Allow user to create new users."
}
