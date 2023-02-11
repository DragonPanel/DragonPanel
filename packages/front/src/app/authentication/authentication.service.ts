import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IIsInittedDto, ILoginDto, ILoginResponseDto, IRegisterDto, IUserPublicDto } from '@dragon-panel/api';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  isInitted(): Observable<boolean> {
    return this.http.get<IIsInittedDto>(API_ENDPOINTS.auth.init).pipe(
      map(res => res.initialized)
    );
  }

  init(data: IRegisterDto): Observable<IUserPublicDto> {
    return this.http.post<IUserPublicDto>(
      API_ENDPOINTS.auth.init,
      data
    );
  }

  login(data: ILoginDto): Observable<ILoginResponseDto> {
    return this.http.post<ILoginResponseDto>(
      API_ENDPOINTS.auth.login,
      data
    );
  }
}
