import { Module } from '@nestjs/common';
import { SystemdService } from './systemd.service';
import { SystemdController } from './systemd.controller';
import { DragondModule } from 'src/dragond/dragond.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import UnitPermission from './permissions/unit.permission';

@Module({
  imports: [
    DragondModule,
    AuthorizationModule.withPermissions([
      UnitPermission
    ])
  ],
  providers: [SystemdService],
  controllers: [SystemdController]
})
export class SystemdModule {}
