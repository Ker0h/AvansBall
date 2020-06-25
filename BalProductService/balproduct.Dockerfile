FROM node:current-alpine3.11

EXPOSE 3000

RUN apk add --update tini \
    && mkdir -p /usr/balproduct_service/

WORKDIR /usr/balproduct_service

COPY . .

RUN npm install \
    && npm cache clean --force