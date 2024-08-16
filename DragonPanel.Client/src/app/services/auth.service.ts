import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ILoginRequest, ISession, IUser } from '../backend/types';
import { catchError, map, Observable, of, retry, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../backend/endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #currentSession = signal<ISession | null | undefined>(undefined);

  public get currentSession() {
    return this.#currentSession.asReadonly();
  }

  public currentUser = computed(() => this.currentSession()?.user ?? null);

  /**
   * This method will reach server to check if session is valid or use cached value.
   * Returns null if user session is invalid or doesn't exists meaning user is unauthorized.
   */
  public getCurrentSession(): Observable<ISession | null> {
    if (this.#currentSession() !== undefined) {
      return of(this.#currentSession() ?? null);
    }

    return this.#http.get<ISession>(ENDPOINTS.currentSession).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Unauthorized) {
          return of(null);
        }
        return throwError(() => err);
      }),
      tap(val => this.#currentSession.set(val)),
      retry(3)
    );
  }

  public isLoggedIn(): Observable<boolean> {
    return this.getCurrentSession().pipe(
      map(v => !!v)
    );
  }

  /**
   * Perform user login. On successful login will set current session.
   * Calling code is responsible for the redirect to proper page after login.
   *
   * @param username
   * @param password
   * @returns an observable containing ISession object in case of successful login or null in case of invalid credentials.
   */
  public login(username: string, password: string): Observable<ISession | null> {
    const payload: ILoginRequest = { username, password };

    return this.#http.post<ISession>(ENDPOINTS.login, payload).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Unauthorized) {
          return of(null);
        }
        return throwError(() => err);
      }),
      tap(val => this.#currentSession.set(val)),
      retry({
        // TODO: Each retry should be with increased duration. Implement standard method
        // for retrying requests only for codes >=500 and non HttpErrorResponses.
        count: 3,
        delay: (error: unknown, retryCount: number) => {
          if (!(error instanceof HttpErrorResponse)) {
            return of(null);
          }

          return error.status < 500 ? throwError(() => error) : of(null);
        }
      })
    );
  }

  public logout(): Observable<void> {
    this.#currentSession.set(null);
    return this.#http.delete<void>(ENDPOINTS.logout);
  }
}
