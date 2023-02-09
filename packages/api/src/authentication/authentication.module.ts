import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/settings';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: "24h"
      }
    }),
    PrismaModule,
    AuthorizationModule
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    JwtStrategy
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
