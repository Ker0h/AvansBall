FROM node:10

EXPOSE 3000

WORKDIR /usr/stock_service

COPY . .

RUN npm install \
    && npm cache clean --force

CMD [ "node", "server.js" ]