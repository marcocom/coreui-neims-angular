import { Component } from '@angular/core';

import { AuthService } from '@auth/services';

@Component({
  selector: 'aqm-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private authService: AuthService) {}

  public login(): void {
    this.authService.login();
  }
}
