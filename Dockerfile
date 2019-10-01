FROM node:lts-alpine

WORKDIR /home/node/app

COPY ./package* ./

RUN npm install && \
    npm cache clear --force

COPY . .

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

RUN npm install -g knex && \
    apk add netcat-openbsd;

COPY wait-for.sh /opt/wait-for.sh 

RUN ["chmod", "+x", "/opt/wait-for.sh"]