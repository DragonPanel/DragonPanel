import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs';
import { handleCriticalGuardError } from './handle-critical-guard-error';

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map(v => v ? router.parseUrl("/") : true),
    catchError(err => handleCriticalGuardError(router, notLoggedInGuard.name, err))
  );
};
