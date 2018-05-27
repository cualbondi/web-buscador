import Vue from 'vue'
import Router from 'vue-router'
import ABSearch from '@/views/ABSearch.vue'
import Recorridos from '@/views/Recorridos.vue'
import LocationSearch from '@/views/LocationSearch.vue'
import MapLocationSearch from '@/views/MapLocationSearch.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'absearch',
      component: ABSearch,
    },
    {
      path: '/location/:point(origin|destination)',
      name: 'location',
      component: LocationSearch,
    },
    {
      path: '/location/:point(origin|destination)/map',
      name: 'map-location',
      component: MapLocationSearch,
    },
  ],
})
