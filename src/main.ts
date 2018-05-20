import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'vuetify/dist/vuetify.min.css'

// TODO: Import only the components that are used instead of everything
// TODO: use a stylus loader to tree-shake unused css

Vue.use(Vuetify, {
  theme: {
    primary: '#4285F4',
  },
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
