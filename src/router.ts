import Vue from 'vue'
import Router from 'vue-router'
import ABSearch from '@/views/ABSearch.vue'
import Recorridos from '@/views/Recorridos.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ABSearch,
    },
    {
      path: '/direcciones',
      name: 'busqueda',
      component: ABSearch,
    },
    {
      path: '/recorridos',
      name: 'recorridos',
      component: Recorridos,
    },
  ],
})
