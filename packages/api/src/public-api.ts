import { IsInittedDto, RegisterDto } from "./authentication/dtos";

export { ILoginResponseDto, IsInittedDto, RegisterDto } from "./authentication/dtos"
export interface IIsInittedDto extends IsInittedDto {}
export interface IRegisterDto extends RegisterDto {}
export interface ILoginDto {
  username: string;
  password: string;
}

export { IUserPublicDto, IUserAdminDto } from "./users/dto/user.dto";

