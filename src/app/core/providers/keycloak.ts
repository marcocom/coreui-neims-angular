import { APP_INITIALIZER, inject, Provider } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';

import { ENVIRONMENT } from './environment';
import { WINDOW } from './web-api';

function initializeKeycloak(keycloak: KeycloakService) {
  const env = inject(ENVIRONMENT);
  const window = inject(WINDOW);

  const { url, realm, clientId } = env.keycloakConfig;

  return () =>
    keycloak.init({
      config: {
        url,
        realm,
        clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
      loadUserProfileAtStartUp: true,
      bearerExcludedUrls: ['/assets'],
    });
}

export const KEYCLOAK_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  multi: true,
  deps: [KeycloakService],
};
