FROM node:16.15-alpine as build

ARG configuration=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY decorate-angular-cli.js ./

RUN npm install
RUN npm install -g nx

COPY . .

RUN nx build api --prod

FROM node:16.15-alpine as production

ARG configuration=production
ENV NODE_ENV=${configuration}

WORKDIR /usr/src/app/

RUN npm install -g pm2

COPY --from=build /usr/src/app/dist/apps/api ./

RUN npm install

CMD ["pm2-runtime", "start", "./main.js"]

EXPOSE 3333
