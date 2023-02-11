import { ILoginDto, IRegisterDto } from "@dragon-panel/api";

export class Login {
  static readonly type = "[Login Page] Login";
  constructor(public payload: ILoginDto) {}
}

export class Init {
  static readonly type = "[Init Page] Init";
  constructor(public payload: IRegisterDto) {}
}

export class Logout {
  static readonly type = "[Authentication] Logout";
}
