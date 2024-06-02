FROM node:18.17.1-alpine

WORKDIR /opt/readmy-notify

COPY ./dist/apps/notify/package*.json .

RUN npm i --omit=dev

COPY ./dist/apps/notify .

CMD ["node", "./main.js"]
