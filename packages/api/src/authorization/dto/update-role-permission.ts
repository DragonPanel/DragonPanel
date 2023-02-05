import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { ActionUpdateDto } from "./action-update.dto";

export class UpdateRolePermission {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsNotEmpty()
  permission: string;

  @IsNotEmpty()
  @Type(() => ActionUpdateDto)
  actions: ActionUpdateDto[]
}
