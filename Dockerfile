FROM node:lts-alpine AS build

WORKDIR /usr/src/app

RUN npm install --ignore-scripts -g pnpm@9.7.0

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm i --ignore-scripts --frozen-lockfile

COPY src ./src
COPY tsconfig.app.json tsconfig.json tsconfig.spec.json ./
COPY angular.json ./

RUN pnpm build --base-href=/admin/

FROM nginx:mainline-alpine-slim AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY nginx/nginx.default.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/admin/browser ./admin

RUN addgroup -g 5000 armonik && adduser -h /home/armonik -u 5000 -G armonik -s /bin/sh armonik -D
USER armonik

RUN mkdir -p /tmp/log/nginx && mkdir -p /tmp/run && mkdir -p /tmp/nginx/{client_body_temp,fastcgi_temp,proxy_temp,uwsgi_temp,scgi_temp}

EXPOSE 1080
