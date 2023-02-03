import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DragondClient } from 'src/dragond/dragond-client.service';
import UnitListEntryDto from './dto/unit-list-entry';

@Injectable()
export class SystemdService {
  constructor(private dragond: DragondClient) {}

  listUnits(): Observable<UnitListEntryDto[]> {
    return this.dragond.listUnits();
  }
}
