FROM node:lts-alpine as build

ARG configuration=production

WORKDIR /usr/src/app

RUN npm install -g nx

COPY .yarn ./
COPY package.json ./
COPY yarn.lock ./
COPY decorate-angular-cli.js ./

RUN yarn

COPY . .

RUN nx build app --prod

FROM nginx:stable as production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
run mkdir ./admin/

COPY --from=build /usr/src/app/nginx.default.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/apps/app ./admin/

RUN groupadd --gid 5000 armonik && useradd --home-dir /home/armonik --create-home --uid 5000 --gid 5000 --shell /bin/sh armonik
USER armonik

RUN mkdir -p /tmp/log/nginx && mkdir -p /tmp/run && mkdir -p /tmp/nginx/{client_body_temp,fastcgi_temp,proxy_temp,uwsgi_temp,scgi_temp}

EXPOSE 1080
