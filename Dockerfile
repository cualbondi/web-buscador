FROM cypress/base:8

MAINTAINER Cualbondi

ARG NODE_ENV=development

ENV NODE_ENV $NODE_ENV

WORKDIR /var/www

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD npm run serve