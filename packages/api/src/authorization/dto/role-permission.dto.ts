import { PermissionActionDto } from "./permission-action.dto";

export default class RolePermissionDto {
  id: string;
  key: string;
  actions: PermissionActionDto[];
}
