FROM node:lts-stretch-slim

RUN apt-get update

RUN apt-get install -y python3 \
    python3-pip \
    git \
    netcat

WORKDIR /temp

RUN git clone https://github.com/platiagro/datatype && \
    cd datatype && \
    pip3 install -e .

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

RUN npm install -g knex

COPY wait-for.sh /opt/wait-for.sh 

RUN ["chmod", "+x", "/opt/wait-for.sh"]