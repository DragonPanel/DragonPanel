import { environment } from "../../environments/environment";

export const ENDPOINTS = {
  initialized: `${environment.apiUrl}/initialized`,
  currentSession: `${environment.apiUrl}/auth/session`,
  createInitialUser: `${environment.apiUrl}/auth/initial-user`,
} as const;
