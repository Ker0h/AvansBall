FROM node:current-alpine3.11

EXPOSE 3000

RUN apk add --update tini \
    && mkdir -p /usr/supplier_service/

WORKDIR /usr/supplier_service

COPY package*.json ./

RUN npm install \
    && npm cache clean --force

COPY . .

CMD [ "tini", "--", "node", "./"]