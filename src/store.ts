import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Pbf from 'pbf'
import geobuf from 'geobuf'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sideMenuOpen: false,
    results: [],
  },
  mutations: {
    setSideMenu(state, open) {
      state.sideMenuOpen = open
    },
    setResults(state, results) {
      state.results = results
    },
  },
  actions: {
    query({ commit }) {
      axios
        .get(
          'http://localhost:8082/api/v3/recorridos/?l=-57.968416213989265%2C-34.910780590483675%2C300%7C-57.960262298583984%2C-34.9169742332207%2C300&c=la-plata&page=1&t=false',
        )
        .then(res => res.data)
        .then(data => commit('setResults', data.results))
    },
    setSideMenu({ commit, state }, value) {
      commit('setSideMenu', value)
    },
    openSideMenu({ commit, state }) {
      commit('setSideMenu', true)
    },
  },
  getters: {
    sideMenuOpen(state) {
      return state.sideMenuOpen
    },
    results(state) {
      return state.results
    },
    getFirstRecorrido(state){
      if (state.results.length === 0 || state.results[0].itinerario.length === 0){
        return []
      }
      const atb = atob(state.results[0].itinerario[0].ruta_corta)
      const pbf = new Pbf(atb)
      const decoded = geobuf.decode(pbf)
      console.log(atb)
      console.log(pbf)
      console.log(decoded)
      return decoded
    }
  },
})
