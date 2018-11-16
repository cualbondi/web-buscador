export const isProd = process.env.NODE_ENV === 'production'

export const API_URL = process.env.VUE_APP_API_URL
  ? process.env.VUE_APP_API_URL
  : isProd
    ? '//api.cualbondi.com.ar/v3'
    : '//localhost:8080/api/v3'

export const SENTRY_URL = isProd
  ? 'https://67b7a80534a5442cb7dabed8033a7d65@sentry.cualbondi.com.ar/5'
  : null

export const GA_KEY = 'UA-20703799-1'

export const BASE_URL = process.env.BASE_URL
