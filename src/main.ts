import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'

// TODO: Import only the components that are used instead of everything
// TODO: use a stylus loader to tree-shake unused css

const isProd = process.env.NODE_ENV == 'production'
const GAid = 'UA-20703799-1'

Vue.use(Vuetify, {
  theme: {
    primary: '#4285F4',
  },
})

Vue.use(VueAnalytics, {
  id: GAid,
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
})

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
