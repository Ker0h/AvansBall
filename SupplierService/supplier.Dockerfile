FROM node:current-alpine3.11

EXPOSE 3000

RUN apk add --update tini \
    && mkdir -p /usr/supplier_service/

WORKDIR /usr/supplier_service

COPY . .

RUN npm install \
    && npm cache clean --force

# Misschien nog een CMD [] commando
# Misschien ook niet door de docker-compose file?
