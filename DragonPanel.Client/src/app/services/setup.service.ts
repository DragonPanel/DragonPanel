import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, retry, tap } from 'rxjs';
import { ENDPOINTS } from '../backend/endpoints';
import { ICreateInitialUserRequest, IInitialized, IUser } from '../backend/types';
import { AuthValidationService } from '../validation/auth-validation.service';
import { assertValidationSuccess, type ValidationException } from '../validation/validation';

/**
 * SetupService is used for initial Dragon Panel setup, mainly for registering first admin user.
 */
@Injectable({
  providedIn: 'root'
})
export class SetupService {
  #http = inject(HttpClient);
  #validation = inject(AuthValidationService);
  #initialized: boolean | null = null;

  isInitialized(): Observable<boolean> {
    if (this.#initialized !== null) {
      //@ts-ignore
      return of(this.#initialized);
    }

    return this.#http.get<IInitialized>(ENDPOINTS.initialized).pipe(
      retry(3),
      map(res => res.initialized),
    );
  }

  /**
   * @throws { ValidationException } in case of failed validation client side.
   * @returns nothing XD
   */
  createInitialAdminUser(username: string, password: string): Observable<void> {
    const r = this.#validation.validateCreateUserCredentials(username, password);
    assertValidationSuccess(r);
    const payload: ICreateInitialUserRequest = { username, password };

    return this.#http.post<void>(ENDPOINTS.createInitialUser, payload).pipe(
      tap(res => this.#initialized = true)
    );
  }
}
