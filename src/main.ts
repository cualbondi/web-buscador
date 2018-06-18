import Vue from 'vue'

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VToolbar,
  transitions,
  VTextField,
  VBtn,
  VIcon,
  VSnackbar,
  VSubheader,
  VDivider,
  VList,
  VSlider,
  VGrid,
} from 'vuetify'
import { Ripple } from 'vuetify/es5/directives'

import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import './registerServiceWorker'

import 'vuetify/src/stylus/app.styl'

import { isProd, GA_KEY, SENTRY_URL } from '@/config'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (SENTRY_URL) {
  Raven.config(SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    transitions,
    VTextField,
    VBtn,
    VIcon,
    VSnackbar,
    VSubheader,
    VDivider,
    VList,
    VSlider,
    VGrid,
  },
  directives: {
    Ripple,
  },
  transitions,
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
}).$mount('#app')

export default vueInstance
