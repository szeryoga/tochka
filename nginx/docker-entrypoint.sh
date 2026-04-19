#!/bin/sh
set -eu

APP_CERT="/etc/letsencrypt/live/${APP_DOMAIN}/fullchain.pem"
APP_KEY="/etc/letsencrypt/live/${APP_DOMAIN}/privkey.pem"

if [ -f "$APP_CERT" ] && [ -f "$APP_KEY" ]; then
  TEMPLATE="/etc/nginx/templates/default.conf.template"
  echo "Using HTTPS nginx config"
else
  TEMPLATE="/etc/nginx/templates/acme.conf.template"
  echo "Certificates not found, using ACME bootstrap config"
fi

envsubst '${APP_DOMAIN} ${APP_BASE_PATH} ${ADMIN_BASE_PATH} ${API_BASE_PATH}' \
  < "$TEMPLATE" \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
