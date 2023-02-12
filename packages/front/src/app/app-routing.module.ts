import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/guards/auth.guard';
import { InittedGuard } from './authentication/guards/initted.guard';
import { NotInittedGuard } from './authentication/guards/not-initted.guard';
import { NotLoggedInGuard } from './authentication/guards/not-logged-in.guard';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    loadComponent: () => import("./dashboard/dashboard.component").then(mod => mod.DashboardComponent)
  },
  {
    path: "login",
    canActivate: [NotLoggedInGuard, InittedGuard],
    loadComponent: () => import("./authentication/login-page/login-page.component").then(mod => mod.LoginPageComponent)
  },
  {
    path: "init",
    canActivate: [NotInittedGuard],
    loadComponent: () => import("./authentication/init-page/init-page.component").then(mod => mod.InitPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
