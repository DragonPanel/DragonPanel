import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export interface ICreateRoleDto extends CreateRoleDto {}
