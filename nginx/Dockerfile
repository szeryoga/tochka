FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY acme.conf.template /etc/nginx/templates/acme.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/docker-entrypoint.sh"]
