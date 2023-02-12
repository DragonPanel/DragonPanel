import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthenticationState } from '../authentication.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    const isAuthenticated = this.store.selectSnapshot(AuthenticationState.isAuthenticated);

    if (isAuthenticated) {
      return true;
    }
    return this.router.parseUrl("/login");
  }

}
