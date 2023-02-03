import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SystemdUnitListEntry } from './interfaces';

@Injectable()
export class DragondClient {
  constructor(private http: HttpService) {}

  // TODO: Create multiple instances and read address from there.
  readonly baseUrl = "http://127.0.0.1:4444";

  listUnits(): Observable<SystemdUnitListEntry[]> {
    return this.http.get(`${this.baseUrl}/systemd/list-units`)
      .pipe(
        map(response => response.data)
      );
  }
}
