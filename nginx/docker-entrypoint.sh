#!/bin/sh
set -eu

APP_CERT="/etc/letsencrypt/live/${APP_DOMAIN}/fullchain.pem"
ADMIN_CERT="/etc/letsencrypt/live/${ADMIN_DOMAIN}/fullchain.pem"
API_CERT="/etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem"

if [ -f "$APP_CERT" ] && [ -f "$ADMIN_CERT" ] && [ -f "$API_CERT" ]; then
  TEMPLATE="/etc/nginx/templates/default.conf.template"
  echo "Using HTTPS nginx config"
else
  TEMPLATE="/etc/nginx/templates/acme.conf.template"
  echo "Certificates not found, using ACME bootstrap config"
fi

envsubst '${APP_DOMAIN} ${ADMIN_DOMAIN} ${API_DOMAIN}' \
  < "$TEMPLATE" \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
