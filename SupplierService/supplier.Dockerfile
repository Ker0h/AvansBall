FROM node:current-alpine3.12

RUN mkdir -p /usr/supplier_service/

WORKDIR /usr/supplier_service

COPY . .

RUN npm install \
    && npm cache clean --force

EXPOSE 3000

CMD [ "npm", "start"]