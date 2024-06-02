FROM node:18.17.1-alpine

WORKDIR /opt/readmy-account

COPY ./dist/apps/account/package*.json .

RUN npm i --omit=dev

COPY ./dist/apps/account .

CMD ["node", "./main.js"]
