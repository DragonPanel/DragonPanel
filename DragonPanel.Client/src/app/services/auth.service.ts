import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ISession } from '../backend/types';
import { catchError, map, Observable, of, retry, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../backend/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #currentSession: ISession | null = null;

  /**
   * This method will reach server to check if session is valid or use cached value.
   * Returns null if user session is invalid or doesn't exists meaning user is unauthorized.
   */
  public getCurrentSession(): Observable<ISession | null> {
    return of(null);

    if (this.#currentSession) {
      return of(this.#currentSession);
    }

    return this.#http.get<ISession>(ENDPOINTS.currentSession).pipe(
      tap(val => this.#currentSession = val),
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Unauthorized) {
          return of(null);
        }
        return throwError(() => err);
      }),
      retry(3)
    );
  }

  /**
   * This method returns false on any API error.
   */
  public isLoggedIn(): Observable<boolean> {
    return this.getCurrentSession().pipe(
      catchError(err => {
        console.error(`Error on AuthService.isLoggedIn: ${err?.message}`);
        console.error(err);
        return of(null);
      }),
      map(v => !!v)
    );
  }
}
