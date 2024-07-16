export interface ISession {
  id: string;
  user: IUser;
}

export interface IInitialized {
  initialized: boolean;
}

export interface ICreateInitialUserRequest {
  username: string;
  password: string;
}

export interface IUser {
  id: string;
  username: string;
  isAdmin: boolean;
}
