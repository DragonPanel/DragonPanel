import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express';
import { IUserPublicDto, UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserId } from './decorators/userId.decorator';
import { Public } from './decorators/public.decorator';
import { ILoginResponseDto, IsInittedDto, RegisterDto } from './dtos';
import { UserAuthorizationService } from 'src/authorization/services/user-authorization.service';
import { RegisterUserPermission } from './permissions/register-user.permission';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private userAuthorization: UserAuthorizationService
  ) {}

  @Public()
  @Get("/init")
  async isInitialized(): Promise<IsInittedDto> {
    const superadminExists = await this.usersService.superadminExists();
    return new IsInittedDto(superadminExists);
  }

  @Public()
  @Post("/init")
  async initSuperadmin(@Body() { username, password }: RegisterDto): Promise<IUserPublicDto> {
    const user = await this.authenticationService.registerFirstSuperAdmin(username, password);
    return UserDto.fromPlain(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req: any): Promise<ILoginResponseDto> {
    return {
      token: req.user!.token
    };
  }

  @Post("/register")
  async register(@Body() body: RegisterDto): Promise<IUserPublicDto> {
    await this.userAuthorization.must(RegisterUserPermission);
    const userRaw = await this.authenticationService.registerUser(body.username, body.password);
    const user = UserDto.fromPlain(userRaw);
    return user;
  }

  @Get("/me")
  async me(@UserId() userId: string): Promise<IUserPublicDto> {
    const userRaw = await this.usersService.findById(userId);
    const user = UserDto.fromPlain(userRaw);
    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/logout")
  async logout(@Request() req: Req) {
    const authHeader = req.headers.authorization;
    const [_, token] = authHeader?.split(" ") ?? [];
    if (token) {
      await this.authenticationService.revokeJwt(token);
    }
  }
}
