FROM cypress/base:10

MAINTAINER Cualbondi

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i

COPY . .

CMD npm run serve
