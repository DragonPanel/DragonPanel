import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { switchMap, tap } from "rxjs";
import { Login } from "./authentication.actions";
import { AuthenticationService } from "./authentication.service";

export interface AuthenticationStateModel {
  token: string | null;
  username: string | null;
  loading: boolean;
}

export const AUTHENTICATION_STATE_TOKEN = new StateToken<AuthenticationStateModel>('authentication');

@State<AuthenticationStateModel>({
  name: AUTHENTICATION_STATE_TOKEN,
  defaults: {
    token: null,
    username: null,
    loading: false
  }
})
@Injectable()
export class AuthenticationState {
  @Selector()
  static token(state: AuthenticationStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthenticationStateModel): boolean {
    return !!state.token;
  }

  constructor(private authenticationService: AuthenticationService) {}

  @Action(Login)
  login(ctx: StateContext<AuthenticationStateModel>, action: Login) {
    ctx.patchState({ loading: true })
    return this.authenticationService.login(action.payload).pipe(
      tap(loginResp => {
        ctx.patchState({
          loading: false,
          token: loginResp.token,
          username: action.payload.username
        });
      })
    );
  }
}
