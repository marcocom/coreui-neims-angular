import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { KeycloakService } from 'keycloak-angular';

import { Environment } from '@core/types';
import { ENVIRONMENT } from '@core/providers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(ENVIRONMENT) private env: Environment,
    private keycloakService: KeycloakService
  ) {}

  public isLoggedIn(): Observable<boolean> {
    return from(this.keycloakService.isLoggedIn());
  }

  public getUsername(): string {
    return this.keycloakService.getUsername();
  }

  public getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  public login(): void {
    this.keycloakService.login({
      redirectUri: this.env.keycloakConfig.postLoginRedirectUri,
    });
  }

  public logout(): Promise<void> {
    return this.keycloakService.logout(
      this.env.keycloakConfig.postLogoutRedirectUri
    );
  }
}
