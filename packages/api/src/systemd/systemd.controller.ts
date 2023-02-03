import { Controller, Get } from '@nestjs/common';
import { SystemdService } from './systemd.service';

@Controller('systemd')
export class SystemdController {
  constructor(private systemd: SystemdService) {}

  @Get('/list-units')
  listUnits() {
    return this.systemd.listUnits();
  }
}
