import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SetupService } from '../services/setup.service';
import { map } from 'rxjs';

export const initializedGuard: CanActivateFn = (route, state) => {
  const setupService = inject(SetupService);
  const router = inject(Router);

  return setupService.isInitialized().pipe(
    map(v => v ? true : router.parseUrl("/setup"))
  );
};
