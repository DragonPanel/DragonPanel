import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { SystemdModule } from './systemd/systemd.module';
import { DragondModule } from './dragond/dragond.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [PrismaModule, AuthenticationModule, UsersModule, SystemdModule, DragondModule, AuthorizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
