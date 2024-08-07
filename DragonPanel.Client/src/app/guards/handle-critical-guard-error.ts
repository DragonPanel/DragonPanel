import { Router } from "@angular/router";
import { of } from "rxjs";

export function handleCriticalGuardError(router: Router, name: string, error: any) {
  console.error(`------- CRITICAL GUARD ERROR -------`);
  console.error(`Guard: ${name}`);
  console.error(error);
  return of(router.parseUrl("/panic"));
}
