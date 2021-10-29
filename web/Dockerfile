FROM node:alpine AS build

WORKDIR /app

# install packages required for building
COPY web/package.json ./
COPY web/package-lock.json ./
RUN npm install

COPY web/public ./public
COPY web/src ./src
COPY web/tsconfig.json ./tsconfig.json
RUN npm run build

# deployment
FROM nginx

RUN mkdir -p /var/www/html
COPY --from=build /app/build /var/www/html

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

