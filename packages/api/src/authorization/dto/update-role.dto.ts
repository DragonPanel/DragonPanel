import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export interface IUpdateRoleDto extends UpdateRoleDto {}
