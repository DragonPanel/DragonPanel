import { environment } from "../../environments/environment";

export const ENDPOINTS = {
  initialized: `${environment.apiUrl}/initialized`,
  currentSession: `${environment.apiUrl}/auth/session`,
  login: `${environment.apiUrl}/auth/login`,
  logout: `${environment.apiUrl}/auth/logout`,
  createInitialUser: `${environment.apiUrl}/auth/initial-user`,
} as const;
