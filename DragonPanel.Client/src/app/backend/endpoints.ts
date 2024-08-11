import { environment } from "../../environments/environment";

export const ENDPOINTS = {
  initialized: `${environment.apiUrl}/setup/initialized`,
  createInitialUser: `${environment.apiUrl}/setup/initial-user`,
  currentSession: `${environment.apiUrl}/auth/session`,
  login: `${environment.apiUrl}/auth/login`,
  logout: `${environment.apiUrl}/auth/logout`,
} as const;
