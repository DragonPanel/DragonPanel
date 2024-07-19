import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SetupService } from '../services/setup.service';
import { catchError, map } from 'rxjs';
import { handleCriticalGuardError } from './handle-critical-guard-error';

export const notInitializedGuard: CanActivateFn = (route, state) => {
  const setupService = inject(SetupService);
  const router = inject(Router);

  return setupService.isInitialized().pipe(
    map(v => v ? router.parseUrl("/") : true),
    catchError(err => handleCriticalGuardError(router, notInitializedGuard.name, err))
  );
};
