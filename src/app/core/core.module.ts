import { NgModule } from '@angular/core';

import { KeycloakAngularModule } from 'keycloak-angular';

import { KEYCLOAK_INITIALIZER } from '@core/providers';

@NgModule({
  imports: [KeycloakAngularModule],
  providers: [KEYCLOAK_INITIALIZER],
})
export class CoreModule {}
