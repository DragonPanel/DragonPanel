import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = "";
  password = "";

  get submitEnabled() {
    return this.username && this.password;
  }

  submit() {
    // TODO uwu
  }
}
