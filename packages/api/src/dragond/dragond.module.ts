import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DragondClient } from './dragond-client.service';

@Module({
  imports: [HttpModule],
  providers: [DragondClient],
  exports: [DragondClient]
})
export class DragondModule {}
