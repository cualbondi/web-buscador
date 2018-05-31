import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'
import { isProd, GA_KEY } from '@/config'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
if (isProd) {
  Raven
    .config('http://67b7a80534a5442cb7dabed8033a7d65@sentry.cualbondi.com.ar/5')
    .addPlugin(RavenVue, Vue)
    .install()
}

// TODO: Import only the components that are used instead of everything
// TODO: use a stylus loader to tree-shake unused css

Vue.use(Vuetify, {
  theme: {
    primary: '#4285F4',
  },
})

Vue.use(VueAnalytics, {
  id: GA_KEY,
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd,
  },
})

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
