FROM node:lts-alpine

RUN npm install -g knex && \
    apk add netcat-openbsd;

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

COPY wait-for.sh /opt/wait-for.sh

RUN ["chmod", "+x", "/opt/wait-for.sh"]