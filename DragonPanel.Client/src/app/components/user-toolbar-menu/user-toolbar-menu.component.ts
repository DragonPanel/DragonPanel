import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-toolbar-menu',
  standalone: true,
  imports: [
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './user-toolbar-menu.component.html',
  styleUrl: './user-toolbar-menu.component.scss'
})
export class UserToolbarMenuComponent {
  #router = inject(Router);
  #authService = inject(AuthService);

  username = computed(() => this.#authService.currentUser()?.displayName ?? "");

  readonly items: MenuItem[] = [
    {
      label: $localize`User settings`,
      icon: 'pi pi-cog',
      routerLink: "/user-settings"
    },
    {
      label: $localize`Logout`,
      icon: 'pi pi-sign-out',
      command: async () => {
        await firstValueFrom(this.#authService.logout());
        this.#router.navigateByUrl("/login");
      }
    }
  ];
}
