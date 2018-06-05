import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocate } from '@/utils'

interface State {
  sideMenuOpen: boolean
  messageText: string
  messageActive: boolean
}

const module: Module<State, RootState> = {
  state: {
    sideMenuOpen: false,
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
  },
  mutations: {
    setSideMenu(state, open: boolean) {
      state.sideMenuOpen = open
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
    messageActive(state) {
      return state.messageActive
    },
    messageText(state) {
      return state.messageText
    },
  },
}
export default module
