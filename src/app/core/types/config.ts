export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  postLoginRedirectUri: string;
  postLogoutRedirectUri: string;
}

export interface MapConfig {
  tileServerUrl: string;
  attribution: string;
}

export interface Environment {
  production: boolean;
  appName: string;
  siteUrl: string;
  stationsServiceUrl: string;
  dataServiceUrl: string;
  mediaServiceUrl: string;
  keycloakConfig: KeycloakConfig;
  mapConfig: MapConfig;
}
