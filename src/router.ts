import Vue from 'vue'
import Router from 'vue-router'
import ABSearch from '@/views/ABSearch.vue'
import Recorridos from '@/views/Recorridos.vue'
import LocationSearch from '@/views/LocationSearch.vue'
import MapLocationSearch from '@/views/MapLocationSearch.vue'
import NotFound from '@/views/NotFound.vue'
import { BASE_URL } from '@/config'
import * as CIUDADES from '@/ciudades'

Vue.use(Router)

const CS: any[] = CIUDADES
const ciudadesRegex = CS.map(c => c.slug).join('|')

export default new Router({
  mode: 'history',
  base: BASE_URL,
  routes: [
    {
      path: `/:ciudadSlug(${ciudadesRegex})/`,
      name: 'absearch',
      component: ABSearch,
    },
    {
      path: `/:ciudadSlug(${ciudadesRegex})/location/:point(origin|destination)`,
      name: 'location',
      component: LocationSearch,
    },
    {
      path: `/:ciudadSlug(${ciudadesRegex})/location/:point(origin|destination)/map`,
      name: 'map-location',
      component: MapLocationSearch,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
})
