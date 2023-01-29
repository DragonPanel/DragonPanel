import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express';
import UserDto from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserId } from './decorators/userId.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req: Req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async me(@UserId() userId: string) {
    const userRaw = await this.usersService.findById(userId);
    const user = UserDto.fromPlain(userRaw);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("/logout")
  async logout(@Request() req: Req) {
    const token = req.headers.authorization;
    if (token) {
      await this.authenticationService.revokeJwt(token);
    }
  }
}
