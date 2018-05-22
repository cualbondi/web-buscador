import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Pbf from 'pbf'
import geobuf from 'geobuf'

Vue.use(Vuex)

let geobufToLatlngs = function(base64str) {
  // convert base64str to Uint8Array
  const raw = atob(base64str)
  let rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));
  for(let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  // decode geobuf into geojson
  const geojson = geobuf.decode(new Pbf(array))

  // flip lat & lng
  let coordinates = geojson.coordinates.slice()
  for (var p = 0; p < coordinates.length; p++) {
    coordinates[p].reverse()
  }

  return coordinates
}

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
          'http://localhost:8082/recorridos/?l=-57.968416213989265%2C-34.910780590483675%2C300%7C-57.960262298583984%2C-34.9169742332207%2C300&c=la-plata&page=1&t=false',
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
      return geobufToLatlngs(state.results[0].itinerario[0].ruta_corta)
    }
  },
})
