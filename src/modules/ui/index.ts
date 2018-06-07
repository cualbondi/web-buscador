import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocate, LatLng } from '@/utils'

interface State {
  sideMenuOpen: boolean
  geolocation: LatLng | null
  appWidth: number
}

const module: Module<State, RootState> = {
  state: {
    sideMenuOpen: false,
    geolocation: null,
    appWidth: 0,
  },
  actions: {
    updateAppWidth({ commit }) {
      commit('setAppWidth', window.innerWidth)
    },
    setSideMenu({ commit }, value: boolean) {
      commit('setSideMenu', value)
    },
    openSideMenu({ commit }) {
      commit('setSideMenu', true)
    },
    geolocate({ commit }) {
      return geolocate().then(latlng => {
        commit('setGeolocation', latlng)
        return latlng
      })
    },
  },
  mutations: {
    setAppWidth(state, width: number) {
      state.appWidth = width
    },
    setSideMenu(state, open: boolean) {
      state.sideMenuOpen = open
    },
    setGeolocation(state, geolocation: LatLng) {
      state.geolocation = geolocation
    },
  },
  getters: {
    isSmallScreen(state) {
      return state.appWidth < 600
    },
    sideMenuOpen(state) {
      return state.sideMenuOpen
    },
    geolocation(state) {
      return state.geolocation
    },
  },
}
export default module
