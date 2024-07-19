import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { usernameValidator } from '../../validation/validators/username.validator';
import { passwordValidator } from '../../validation/validators/password.validator';
import { firstValueFrom, map } from 'rxjs';
import { IValidationError } from '../../validation/validation';
import { AsyncPipe } from '@angular/common';
import { SetupService } from '../../services/setup.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [
    SharedModule,
    AsyncPipe,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  #setupService = inject(SetupService);
  #notificationService = inject(NotificationService);
  #router = inject(Router);

  setupGroup = new FormGroup({
    username: new FormControl('', { validators: [ Validators.required, usernameValidator() ], nonNullable: true }),
    password: new FormControl('', { validators: [ Validators.required, passwordValidator() ], nonNullable: true })
  });

  username = this.setupGroup.controls.username;
  password = this.setupGroup.controls.password;

  usernameErrors$ = this.username.valueChanges.pipe(
    map(val => this.mapSGValidationErrors(val, this.username, usernameValidator.key))
  );

  passwordErrors$ = this.password.valueChanges.pipe(
    map(val => this.mapSGValidationErrors(val, this.password, passwordValidator.key))
  );

  private mapSGValidationErrors(val: any, control: AbstractControl, validatorKey: string) {
    if (!control.dirty || !val) {
      return null;
    }

    return (control.getError(validatorKey) as IValidationError[] | null)?.map(err => err.description) ?? null;
  }

  async submit() {
    if (!this.setupGroup.valid) {
      return;
    }

    const v = this.setupGroup.value;
    try {
      await firstValueFrom(this.#setupService.createInitialAdminUser(v.username!, v.password!));
      this.#router.navigateByUrl("/");
    }
    catch (err: any) {
      this.#notificationService.error("Setup error", err.message ?? "Uknown error, check console.");
      console.error(err);
    }
  }
}
