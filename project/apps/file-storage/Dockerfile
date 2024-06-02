FROM node:18.17.1-alpine

WORKDIR /opt/readmy-file-storage

COPY ./dist/apps/file-storage/package*.json .

RUN npm i --omit=dev

COPY ./dist/apps/file-storage .

CMD ["node", "./main.js"]
