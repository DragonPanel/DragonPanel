import { environment } from "src/environments/environment";

const base = environment.backendBaseUrl;

export const API_ENDPOINTS = {
  auth: {
    init: `${base}/api/auth/init`,
    login: `${base}/api/auth/login`
  }
}
