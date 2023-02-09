import { PermissionMode } from "../enums/permission-mode";

export default class RolePermissionDto {
  id: string;
  key: string;
  mode: PermissionMode;
}
