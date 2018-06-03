import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocate, LatLng } from '@/utils'

interface State {
  sideMenuOpen: boolean
  geolocation: LatLng | null
  messageText: string
  messageActive: boolean
}

const module: Module<State, RootState> = {
  state: {
    sideMenuOpen: false,
    geolocation: null,
    messageText: '',
    messageActive: false,
  },
  actions: {
    setSideMenu({ commit }, value: boolean) {
      commit('setSideMenu', value)
    },
    openSideMenu({ commit }) {
      commit('setSideMenu', true)
    },
    message({ commit }, text: string) {
      commit('setMessageText', text)
      commit('setMessageActive', true)
    },
    setMessageActive({ commit }, active: boolean) {
      commit('setMessageActive', active)
    },
    geolocate({ commit, dispatch }) {
      return geolocate().then(latlng => {
        commit('setGeolocation', latlng)
        return latlng
      }).catch(() => {
        dispatch('message', 'No se pudo acceder a la geolocalizacion')
      })
    },
  },
  mutations: {
    setSideMenu(state, open: boolean) {
      state.sideMenuOpen = open
    },
    setGeolocation(state, geolocation: LatLng) {
      state.geolocation = geolocation
    },
    setMessageText(state, text: string) {
      state.messageText = text
    },
    setMessageActive(state, active: boolean) {
      state.messageActive = active
    },
  },
  getters: {
    sideMenuOpen(state) {
      return state.sideMenuOpen
    },
    geolocation(state) {
      return state.geolocation
    },
    messageActive(state) {
      return state.messageActive
    },
    messageText(state) {
      return state.messageText
    },
  },
}
export default module
