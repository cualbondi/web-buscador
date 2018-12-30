[![Build Status](https://travis-ci.org/cualbondi/web-buscador.svg?branch=master)](https://travis-ci.org/cualbondi/web-buscador)

# Web-buscador

Nuevo front para el buscador de cualbondi con tecnologias del 2018 basado en vue2

## How to contribute

1. Correr el app

`docker-compose -f docker-compose.dev.yml up --build`

Si se necesita agregar un package o actualizar las dependencias, es necesario hacerlo a través de docker:

1. Actualizar el package.json agregando la dependencia (en el host)

2. Instalar o actualizar la misma (en el container):

    `docker-compose -f docker-compose.dev.yml run --rm web-buscador npm install`

3. Commitear el package.json y el lock file

### Update en produccion de solamente web-buscador

    docker-compose -f docker-compose.prod.yml up --build --force-recreate web-buscador && docker-compose -f docker-compose.prod.yml restart proxy

## Top contributors

[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/0)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/0)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/1)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/1)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/2)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/2)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/3)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/3)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/4)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/4)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/5)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/5)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/6)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/6)[![](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/images/7)](https://sourcerer.io/fame/jperelli/cualbondi/web-buscador/links/7)
