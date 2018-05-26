import { Module } from 'vuex'
import { RootState } from '@/store'

interface State {
    sideMenuOpen: boolean,
}

const module: Module<State, RootState> = {
  state: {
      sideMenuOpen: false,
  },
  actions: {
    setSideMenu({ commit }, value) {
      commit('setSideMenu', value)
    },
    openSideMenu({ commit }) {
      commit('setSideMenu', true)
    },
  },
  mutations: {
    setSideMenu(state, open) {
      state.sideMenuOpen = open
    },
  },
  getters: {
    sideMenuOpen(state) {
      return state.sideMenuOpen
    },
  },
}
export default module
