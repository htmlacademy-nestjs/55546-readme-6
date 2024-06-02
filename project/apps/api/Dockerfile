FROM node:18.17.1-alpine

WORKDIR /opt/readmy-api

COPY ./dist/apps/api/package*.json .

RUN npm i --omit=dev

COPY ./dist/apps/api .

CMD ["node", "./main.js"]
