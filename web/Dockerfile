FROM node:alpine

ENV APP=web
# install package required for serving
RUN npm i -g serve
# install packages required for building
COPY web/package.json ./
COPY web/package-lock.json ./
RUN npm i

COPY web/public ./public
COPY web/src ./src
COPY web/tsconfig.json ./tsconfig.json
RUN npm run build

