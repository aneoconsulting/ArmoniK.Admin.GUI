FROM node:16.14.2-alpine as build

ARG configuration=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY decorate-angular-cli.js ./

RUN npm install
RUN npm install -g nx

COPY . .
RUN nx build app --prod

FROM nginx:stable as production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /usr/src/app/dist/apps/app .
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
