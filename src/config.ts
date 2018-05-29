export const isProd = process.env.NODE_ENV === 'production'

export const API_URL = isProd ?
    'https://api.cualbondi.com.ar/v3' :
    'http://localhost:8082'

export const GA_KEY = 'UA-20703799-1'

export const BASE_URL = process.env.BASE_URL