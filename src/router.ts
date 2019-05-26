import Vue from 'vue'
import Router from 'vue-router'
import Root from '@/views/Root.vue'
import ABSearch from '@/views/ABSearch.vue'
import Recorridos from '@/views/Recorridos.vue'
import Editor from '@/admin/Editor.vue'
import OSMDashboard from '@/admin/OSMDashboard.vue'
import OSMDashboardStats from '@/admin/OSMDashboardStats.vue'
import LocationSearch from '@/views/LocationSearch.vue'
import MapLocationSearch from '@/views/MapLocationSearch.vue'
import NotFound from '@/views/NotFound.vue'
import Login from '@/views/Login.vue'
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
      component: Login,
    },
    {
      path: `/editor/`,
      name: 'editor',
      component: Editor,
    },
    {
      path: `/osm/`,
      name: 'osm',
      component: OSMDashboard,
    },
    {
      path: `/osm/stats/`,
      name: 'osmstats',
      component: OSMDashboardStats,
    },
    {
      path: `/:ciudadSlug/:location?`,
      name: 'absearch-2',
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
      component: NotFound,
    },
  ],
})
