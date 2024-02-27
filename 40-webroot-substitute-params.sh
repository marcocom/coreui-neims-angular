#!/bin/sh

set -e

PARAMS='
$SITE_URL
$STATIONS_SERVICE_URL
$DATA_SERVICE_URL
$MEDIA_SERVICE_URL
$KEYCLOAK_URL
$KEYCLOAK_REALM
$KEYCLOAK_CLIENT_ID
$KEYCLOAK_POST_LOGIN_REDIRECT_URI
$KEYCLOAK_POST_LOGOUT_REDIRECT_URI
'

app_dir='/usr/share/nginx/html'
find "$app_dir" -follow -type f \( -name "*.js" -o -name "*.html" \) -print | while read -r orig_f; do
  temp_f=$(mktemp -u)
  envsubst "$PARAMS" <$orig_f >$temp_f
  cp $temp_f $orig_f
  rm $temp_f
done

exit 0
