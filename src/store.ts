import Vue from 'vue'
import Vuex from 'vuex'

import absearch from '@/modules/absearch'
import ui from '@/modules/ui'
import core from '@/modules/core'
import geocoder from '@/modules/geocoder'
import auth from '@/modules/auth'
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
    core,
    geocoder,
    auth,
  },
  strict: isProd,
  plugins: [analyticsMiddleware],
})
