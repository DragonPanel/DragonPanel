import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { ActionUpdateDto } from "./action-update.dto";

export class UpdateUserPermissionsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  permission: string;

  @IsNotEmpty()
  @Type(() => ActionUpdateDto)
  actions: ActionUpdateDto[]
}
