import { Routes } from '@angular/router';
import { loggedInGuard } from './guards/logged-in.guard';
import { notLoggedInGuard } from './guards/not-logged-in.guard';
import { notInitializedGuard } from './guards/not-initialized.guard';
import { initializedGuard } from './guards/initialized.guard';

const authorizedRoutes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./pages/dashboard/dashboard.component").then(
        c => c.DashboardComponent
      ),
  },
]

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [loggedInGuard],
    children: authorizedRoutes
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then(c => c.LoginComponent),
    // initializedGuard is needed only in login route because you can't login when
    // app is not initialized and you can't use app if you're not authorized XD
    canActivate: [notLoggedInGuard, initializedGuard],
    data: { layoutless: true }
  },
  {
    path: "setup",
    loadComponent: () => import("./pages/setup/setup.component").then(c => c.SetupComponent),
    canActivate: [notInitializedGuard],
    data: { layoutless: true }
  },
];
