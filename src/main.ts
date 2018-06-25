import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import vueHeadful from 'vue-headful'
import VueScript2 from 'vue-script2'
import VueAds from 'vue-google-adsense'

import './registerServiceWorker'

import 'vuetify/src/stylus/app.styl'

import { isProd, GA_KEY, SENTRY_URL } from '@/config'

import Vuetify from 'vuetify/es5/components/Vuetify'
import VApp from 'vuetify/es5/components/VApp'
import { Ripple } from 'vuetify/es5/directives'
import VNavigationDrawer from 'vuetify/es5/components/VNavigationDrawer'
import VList from 'vuetify/es5/components/VList'
import VBtn from 'vuetify/es5/components/VBtn'
import VIcon from 'vuetify/es5/components/VIcon'
import VDivider from 'vuetify/es5/components/VDivider'
import VSlider from 'vuetify/es5/components/VSlider'
import VSnackbar from 'vuetify/es5/components/VSnackbar'
import VTextField from 'vuetify/es5/components/VTextField'
import VSubheader from 'vuetify/es5/components/VSubheader'
import VToolbar from 'vuetify/es5/components/VToolbar'
import VGrid from 'vuetify/es5/components/VGrid'
import VSelect from 'vuetify/es5/components/VSelect'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (SENTRY_URL) {
  Raven.config(SENTRY_URL)
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.component('vue-headful', vueHeadful)

Vue.use(VueScript2)
Vue.use(VueAds.Adsense)
Vue.use(VueAds.InFeedAdsense)

Vue.use(Vuetify, {
  components: {
    VApp,
    Vuetify,
    VNavigationDrawer,
    VIcon,
    VBtn,
    VList,
    VDivider,
    VSlider,
    VSnackbar,
    VTextField,
    VSubheader,
    VToolbar,
    VGrid,
    VSelect,
  },
  directives: {
    Ripple,
  },
  theme: {
    primary: '#51B2E0',
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
document.addEventListener('DOMContentLoaded', function() {
  vueInstance.$mount('#app')
})
export default vueInstance
