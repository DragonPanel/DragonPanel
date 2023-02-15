import { ILoginDto } from "@dragon-panel/api";

export class Login {
  static readonly type = "[Login Page] Login";
  constructor(public payload: ILoginDto) {}
}

export class Logout {
  static readonly type = "[Authentication] Logout";
}
