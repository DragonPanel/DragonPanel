import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  #authService = inject(AuthService);
  #notificationService = inject(NotificationService);
  #router = inject(Router);

  username = "";
  password = "";

  get submitEnabled() {
    return this.username && this.password;
  }

  async submit() {
    try {
      await firstValueFrom(this.#authService.login(this.username, this.password));
      this.#router.navigateByUrl("/");
    }
    catch (err: any) {
      console.error(err);

      if (err instanceof HttpErrorResponse && err.status === 401) {
        this.#notificationService.error($localize`Invalid username or password`, "Invalid username or password.");
      }
      else {
        this.#notificationService.error($localize`Authentication error`, err.message ?? "Unknown error, check console");
      }
    }
  }
}
