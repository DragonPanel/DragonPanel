import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/logged-in.guard';
import { notLoggedInGuard } from './guards/not-logged-in.guard';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/dashboard/dashboard.component").then(
        c => c.DashboardComponent
      ),
    canActivate: [loggedInGuard],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then(c => c.LoginComponent),
    canActivate: [notLoggedInGuard],
  },
];
