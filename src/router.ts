import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/views/Root.vue'
import ABSearch from '@/views/ABSearch.vue'
import LocationSearch from '@/views/LocationSearch.vue'
import MapLocationSearch from '@/views/MapLocationSearch.vue'
import NotFound from '@/views/NotFound.vue'
import RealTime from '@/views/RealTime.vue'
import { BASE_URL } from '@/config'
import CIUDADES from '@/ciudades'

Vue.use(Router)

const CS: any[] = CIUDADES
const ciudadesRegex = CS.map(c => c.slug).join('|')

export default new Router({
  mode: 'history',
  base: BASE_URL,
  routes: [
    {
      path: `/`,
      name: 'root',
      component: Root,
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
      path: `/:ciudadSlug(${ciudadesRegex})/:location?`,
      name: 'absearch',
      component: ABSearch,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
})
