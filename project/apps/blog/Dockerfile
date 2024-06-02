FROM node:18.17.0-slim

RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /opt/readmy-blog

COPY ./dist/apps/blog/package*.json .

RUN npm i --omit=dev

# COPY ./dist/apps/blog/assets/prisma/schema.prisma ./schema.prisma
COPY ./dist/apps/blog/assets/prisma/* ./prisma

RUN npx prisma generate --schema ./prisma/schema.prisma

RUN cp -R ../../node_modules/.prisma ./node_modules && rm -rf ../node_modules

COPY ./dist/apps/blog .

CMD ["node", "./main.js"]
