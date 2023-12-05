FROM node:lts-alpine as build

WORKDIR /usr/src/app

RUN npm install --ignore-scripts -g pnpm @antfu/ni 

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

RUN nci

COPY src ./src
COPY tsconfig.app.json tsconfig.json tsconfig.spec.json ./
COPY angular.json ./

RUN nr build --base-href=/admin/

FROM nginx:stable as production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY nginx/nginx.default.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/ .

RUN groupadd --gid 5000 armonik && useradd --home-dir /home/armonik --create-home --uid 5000 --gid 5000 --shell /bin/sh armonik
USER armonik

RUN mkdir -p /tmp/log/nginx && mkdir -p /tmp/run && mkdir -p /tmp/nginx/{client_body_temp,fastcgi_temp,proxy_temp,uwsgi_temp,scgi_temp}

EXPOSE 1080
