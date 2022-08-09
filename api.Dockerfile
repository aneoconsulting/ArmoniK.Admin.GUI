FROM node:lts-alpine as build

ARG configuration=production

WORKDIR /usr/src/app

RUN npm install -g nx

COPY package*.json ./
COPY decorate-angular-cli.js ./

RUN npm ci

COPY . .

RUN nx build api --prod

FROM node:lts-alpine as production

ARG configuration=production
ENV NODE_ENV=${configuration}

WORKDIR /usr/src/app/

RUN npm install -g pm2

RUN addgroup --gid 5000 armonik && adduser -u 5000 -G armonik --shell /bin/sh --home /usr/src/app --disabled-password armonik
USER armonik

COPY --from=build /usr/src/app/dist/apps/api ./

RUN npm install

CMD ["pm2-runtime", "start", "./main.js"]

EXPOSE 3333
