import Vue from 'vue'
import Vuex from 'vuex'

import absearch from './modules/absearch'
import ui from './modules/ui'
import analyticsMiddleware from './analyticsMiddleware'

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
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    analyticsMiddleware
  ]
})
