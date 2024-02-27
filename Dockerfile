FROM node:16 as build

WORKDIR /app
COPY package.json yarn.lock /app/
COPY utils/ /app/utils/
RUN env FORCE_COLOR=0 yarn install
COPY . /app
RUN env FORCE_COLOR=0 yarn install
RUN env FORCE_COLOR=0 yarn --verbose build

FROM nginx:1.19.7-alpine
EXPOSE 8080
ENV SITE_URL='https://fe.redacted.introduct.org/'
ENV STATIONS_SERVICE_URL='https://stations.redacted.introduct.org/api/v1/'
ENV DATA_SERVICE_URL='https://data.redacted.introduct.org/api/v1/'
ENV MEDIA_SERVICE_URL='https://media.redacted.introduct.org/api/v1/images'
ENV KEYCLOAK_URL='https://keycloak.redacted.introduct.org/auth/'
ENV KEYCLOAK_REALM='redacted-realm'
ENV KEYCLOAK_CLIENT_ID='redacted-client'
ENV KEYCLOAK_POST_LOGIN_REDIRECT_URI='https://fe.redacted.introduct.org/'
ENV KEYCLOAK_POST_LOGOUT_REDIRECT_URI='https://fe.redacted.introduct.org/auth/login/'
COPY 40-webroot-substitute-params.sh /docker-entrypoint.d/
COPY nginx-svc.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-coreui /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
