import { Module } from 'vuex'
import { RootState } from '@/store'

type ITab = 'recorridos' | 'directions'

interface State {
  sideMenuOpen: boolean
  smallResults: boolean
  messageText: string
  messageActive: boolean
  shareModalOpen: boolean
  tab: ITab
}

const module: Module<State, RootState> = {
  state: {
    sideMenuOpen: false,
    smallResults: false,
    messageText: '',
    messageActive: false,
    shareModalOpen: false,
    tab: 'recorridos',
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
    setTab({ commit }, tab: ITab) {
      commit('setTab', tab)
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
    setTab(state, tab: ITab) {
      state.tab = tab
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
    getTab(state) {
      return state.tab
    },
  },
}
export default module
