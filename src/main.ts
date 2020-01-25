import Vue from 'vue'
import App from './App.vue'
import router from '@/plugins/router'
import store from '@/plugins/store'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import VueAnalytics from 'vue-analytics'
import vueHeadful from 'vue-headful'

import './registerServiceWorker'

import { isProd, GA_KEY, SENTRY_URL } from '@/config'

import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

if (SENTRY_URL) {
  Sentry.init({
    dsn: SENTRY_URL,
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  })
}

Vue.component('vue-headful', vueHeadful)

Vue.use(VueAnalytics, {
  id: GA_KEY,
  router,
  debug: {
    enabled: false,
    sendHitTask: isProd,
  },
})

Vue.config.productionTip = false

export interface VueExtended extends Vue {
  $ga?: any
}
const vueInstance: VueExtended = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
})
document.addEventListener('DOMContentLoaded', function() {
  vueInstance.$mount('#app')
})
export default vueInstance
