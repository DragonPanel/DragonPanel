import { Module } from '@nestjs/common';
import { SystemdService } from './systemd.service';
import { SystemdController } from './systemd.controller';
import { DragondModule } from 'src/dragond/dragond.module';

@Module({
  imports: [DragondModule],
  providers: [SystemdService],
  controllers: [SystemdController]
})
export class SystemdModule {}
