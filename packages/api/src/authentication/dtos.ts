import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9\s_]*[a-zA-Z0-9]$/)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}

export class IsInittedDto {
  constructor(initalized: boolean) {
    this.initialized = initalized;
  }

  @Expose()
  initialized: boolean;
}

export interface ILoginResponseDto {
  token: string;
}
