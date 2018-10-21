FROM cypress/base:10

MAINTAINER Cualbondi

ARG NODE_ENV=development

ENV NODE_ENV $NODE_ENV

RUN mkdir /app

WORKDIR /app/

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

CMD yarn serve
