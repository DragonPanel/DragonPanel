import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PermissionMode } from "../enums/permission-mode";

export class SetPermissionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsEnum(PermissionMode)
  mode: PermissionMode;
}
