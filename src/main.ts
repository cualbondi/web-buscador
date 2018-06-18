import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import vueHeadful from 'vue-headful'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'
import { isProd, GA_KEY, SENTRY_URL } from '@/config'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (SENTRY_URL) {
  Raven
    .config(SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install()
}

// TODO: Import only the components that are used instead of everything
// TODO: use a stylus loader to tree-shake unused css
Vue.component('vue-headful', vueHeadful);

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

interface VueExtended extends Vue {
  $ga?: any
}
const vueInstance: VueExtended = new Vue({
  router,
  store,
  render: h => h(App),
})
document.addEventListener('DOMContentLoaded', function () {
  vueInstance.$mount('#app')
})
export default vueInstance
