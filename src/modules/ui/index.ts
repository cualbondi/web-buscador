import { Module } from 'vuex'
import { RootState } from '@/store'

interface State {
  sideMenuOpen: boolean
  smallResults: boolean
  messageText: string
  messageActive: boolean
  shareModalOpen: boolean
}

const module: Module<State, RootState> = {
  state: {
    sideMenuOpen: false,
    smallResults: false,
    messageText: '',
    messageActive: false,
    shareModalOpen: false,
  },
  actions: {
    toggleSmallResults({ commit }) {
      commit('toggleSmallResults')
    },
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
    setShareModal({ commit }, active = true) {
      commit('setShareModal', active)
    },
  },
  mutations: {
    toggleSmallResults(state) {
      state.smallResults = !state.smallResults
    },
    setSideMenu(state, open: boolean) {
      state.sideMenuOpen = open
    },
    setMessageText(state, text: string) {
      state.messageText = text
    },
    setMessageActive(state, active: boolean) {
      state.messageActive = active
    },
    setShareModal(state, active: boolean) {
      state.shareModalOpen = active
    },
  },
  getters: {
    getSmallResults(state) {
      return state.smallResults
    },
    sideMenuOpen(state) {
      return state.sideMenuOpen
    },
    messageActive(state) {
      return state.messageActive
    },
    messageText(state) {
      return state.messageText
    },
    shareModalOpen(state) {
      return state.shareModalOpen
    },
  },
}
export default module
