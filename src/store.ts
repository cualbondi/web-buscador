import Vue from 'vue'
import Vuex from 'vuex'

import absearch from '@/modules/absearch'
import ui from '@/modules/ui'
import analyticsMiddleware from '@/middleware/analytics'
import { isProd } from '@/config'

Vue.use(Vuex)

export interface RootState {}

export default new Vuex.Store<RootState>({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    absearch,
    ui,
  },
  strict: isProd,
  plugins: [analyticsMiddleware],
})
