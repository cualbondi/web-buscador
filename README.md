[![Build Status](https://travis-ci.org/cualbondi/web-buscador.svg?branch=master)](https://travis-ci.org/cualbondi/web-buscador)

# Web-buscador

Nuevo front para el buscador de cualbondi con tecnologias del 2018 basado en vue2




# Update en produccion de solamente web-buscador

    docker-compose -f docker-compose.prod.yml up --build --force-recreate web-buscador && docker-compose -f docker-compose.prod.yml restart proxy
