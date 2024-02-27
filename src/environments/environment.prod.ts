import { Environment } from '@core/types';

export const environment: Environment = {
  production: true,
  appName: 'NEIMS AQM',
  siteUrl: '$SITE_URL',
  stationsServiceUrl: '$STATIONS_SERVICE_URL',
  dataServiceUrl: '$DATA_SERVICE_URL',
  mediaServiceUrl: '$MEDIA_SERVICE_URL',
  keycloakConfig: {
    url: '$KEYCLOAK_URL',
    realm: '$KEYCLOAK_REALM',
    clientId: '$KEYCLOAK_CLIENT_ID',
    postLoginRedirectUri: '$KEYCLOAK_POST_LOGIN_REDIRECT_URI',
    postLogoutRedirectUri: '$KEYCLOAK_POST_LOGOUT_REDIRECT_URI',
  },
  mapConfig: {
    tileServerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};
