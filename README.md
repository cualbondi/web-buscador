[![Build Status](https://travis-ci.org/cualbondi/web-buscador.svg?branch=master)](https://travis-ci.org/cualbondi/web-buscador)

# Web-buscador

Nuevo front para el buscador de cualbondi con tecnologias del 2018 basado en vue2

## How to contribute

1. Correr el app

`docker-compose -f docker-compose.dev.yml up --build`

Si se necesita agregar un package o actualizar las dependencias, es necesario hacerlo a través de docker:

1. Actualizar el package.json agregando la dependencia (en el host)

2. Instalar o actualizar la misma (en el container):

    `docker-compose -f docker-compose.dev.yml npm <install|update>`

3. Commitear el package.json y el lock file

### Update en produccion de solamente web-buscador

    docker-compose -f docker-compose.prod.yml up --build --force-recreate web-buscador && docker-compose -f docker-compose.prod.yml restart proxy
