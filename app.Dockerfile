FROM node:lts-alpine as build

ARG configuration=production

WORKDIR /usr/src/app

RUN npm install -g nx pnpm @antfu/ni

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY decorate-angular-cli.js ./

RUN nci

COPY . .

RUN nx build app --prod --baseHref=/admin-0.9/

FROM nginx:1.25.2-alpine3.18-slim as production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
RUN mkdir ./admin-0.9/

COPY --from=build /usr/src/app/nginx.default.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/apps/app ./admin-0.9

RUN addgroup -g 5000 -S armonikuser && adduser -D -h /home/armonikuser  -u 5000 -G armonikuser --shell /bin/sh armonikuser
USER armonikuser

RUN mkdir -p /tmp/log/nginx && mkdir -p /tmp/run && mkdir -p /tmp/nginx/{client_body_temp,fastcgi_temp,proxy_temp,uwsgi_temp,scgi_temp}

EXPOSE 1080
