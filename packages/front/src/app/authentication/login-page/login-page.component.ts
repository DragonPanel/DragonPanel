import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Selector, Store } from '@ngxs/store';
import { PasswordModule } from 'primeng/password';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { Login } from '../authentication.actions';
import { AuthenticationState } from '../authentication.state';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [SharedModule, PasswordModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(private store: Store) {}

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  @Select(AuthenticationState.loading) loading$!: Observable<boolean>;

  get formValid() {
    return this.loginForm.valid;
  }

  async submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { username, password } = this.loginForm.value;

    this.store.dispatch(new Login({
      username: username!,
      password: password!
    }));
  }
}
