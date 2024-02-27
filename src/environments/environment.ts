// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '@core/types';

export const environment: Environment = {
  production: false,
  appName: 'CORE-UI',
  siteUrl: 'http://localhost:4200/',
  stationsServiceUrl: '/stations/',
  dataServiceUrl: '/data/',
  mediaServiceUrl:
    'https://media.redacted.introduct.org/api/v1/images',
  keycloakConfig: {
    url: 'https://keycloak.redacted.introduct.org/auth/',
    realm: 'redacted-realm',
    clientId: 'redacted-client',
    postLoginRedirectUri: 'http://localhost:4200/',
    postLogoutRedirectUri: 'http://localhost:4200/auth/login/',
  },
  mapConfig: {
    tileServerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
