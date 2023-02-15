import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordModule } from 'primeng/password';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-init-page',
  imports: [SharedModule, PasswordModule],
  templateUrl: './init-page.component.html',
  styleUrls: ['./init-page.component.scss']
})
export class InitPageComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notifications: NotificationService
  ) {}

  readonly usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s_]*[a-zA-Z0-9]$/;
  readonly minUsernameLength = 3;
  readonly maxUsernameLength = 16;
  readonly minPasswordLength = 8;
  readonly maxPasswordLength = 72;

  initForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(this.usernameRegex),
      Validators.minLength(this.minUsernameLength),
      Validators.maxLength(this.maxUsernameLength)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.minPasswordLength),
      Validators.maxLength(this.maxPasswordLength)
    ])
  });

  loading = false;

  get formValid() {
    return this.initForm.valid;
  }

  async submit() {
    if (!this.initForm.valid) {
      return;
    }

    const { username, password } = this.initForm.value;

    this.loading = true;

    try {
      await firstValueFrom(this.authenticationService.init({
        username: username!,
        password: password!
      }));

      this.router.navigate(['/login']);
    }
    catch(err) {
      this.notifications.error({
        title: $localize`Init error`,
        content: err?.toString() ?? $localize`No error data was given :(`
      });
    }
    finally {
      this.loading = false;
    }
  }
}
