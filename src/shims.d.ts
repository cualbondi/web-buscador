// to be able to use es6 imports with pngs
declare module '*.png'

// modules without type definitions
declare module 'vue2-leaflet'
declare module 'geobuf'
declare module 'vue2-leaflet-polylinedecorator'
declare module 'vue2-leaflet-editablecirclemarker'
declare module 'vue-analytics'
declare module 'raven-js/plugins/vue'
declare module 'vue-headful'

// from https://github.com/vuetifyjs/vuetify/issues/3943#issuecomment-388034052
declare module 'vuetify/es5/components/*' {
  import { PluginFunction } from 'vue'
  namespace Component {
    const install: PluginFunction<never>
  }
  export default Component
}
declare module 'vuetify/es5/directives'

declare module '@/ciudades'

interface LatLng {
  lat: number
  lng: number
}
