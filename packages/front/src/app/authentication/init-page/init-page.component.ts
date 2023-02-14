import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordModule } from 'primeng/password';
import { Store } from '@ngxs/store';

@Component({
  standalone: true,
  selector: 'app-init-page',
  imports: [SharedModule, PasswordModule],
  templateUrl: './init-page.component.html',
  styleUrls: ['./init-page.component.scss']
})
export class InitPageComponent {
  constructor(private store: Store) {}

  readonly usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s_]*[a-zA-Z0-9]$/;
  readonly minUsernameLength = 3;
  readonly maxUsernameLength = 16;
  readonly minPasswordLength = 8;
  readonly maxPasswordLength = 72;

  password = "";
  username = "";

  get usernameValid() {
    return this.usernameRegex.test(this.username)
      && this.username.length >= this.minUsernameLength
      && this.username.length <= this.maxUsernameLength
  }

  get passwordValid() {
    // return this.password.length >= this.minPasswordLength
    //   && this.password.length <= this.maxPasswordLength
    return false;
  }

  get formValid() {
    return this.usernameValid && this.passwordValid;
  }
}
