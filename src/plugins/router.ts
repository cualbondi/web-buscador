import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/views/Root.vue'
import ABSearch from '@/views/ABSearch.vue'
import Recorridos from '@/views/Recorridos.vue'
import LocationSearch from '@/views/LocationSearch.vue'
import MapLocationSearch from '@/views/MapLocationSearch.vue'
import { BASE_URL } from '@/config'

Vue.use(Router)

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
      path: `/login`,
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: `/editor/`,
      name: 'editor',
      component: () => import('@/admin/Editor.vue'),
    },
    {
      path: `/osm/`,
      name: 'osm',
      component: () => import('@/admin/OSMDashboard.vue'),
    },
    {
      path: `/osm/stats/`,
      name: 'osmstats',
      component: () => import('@/admin/OSMDashboardStats.vue'),
    },
    {
      path: `/:ciudadSlug/recorridos/:searchString?`,
      name: 'recorridos',
      component: Recorridos,
    },
    {
      path: `/:ciudadSlug/`,
      name: 'absearch',
      component: ABSearch,
    },
    {
      path: `/:ciudadSlug/location/:point(origin|destination)`,
      name: 'location',
      component: LocationSearch,
    },
    {
      path: `/:ciudadSlug/location/:point(origin|destination)/map`,
      name: 'map-location',
      component: MapLocationSearch,
    },
    {
      path: `/:ciudadSlug/:location?`,
      name: 'absearch-2',
      component: ABSearch,
    },
    {
      path: '*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})
