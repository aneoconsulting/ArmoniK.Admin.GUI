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

FROM nginxinc/nginx-unprivileged:mainline-alpine-slim AS production

WORKDIR /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/admin/browser ./admin

EXPOSE 1080
