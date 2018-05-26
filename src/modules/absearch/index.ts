import { Module } from 'vuex'
import { LatLng } from 'leaflet'
import { RootState } from '@/store'
import { geobufToLatlngs } from '@/utils'
import api from '@/api'

interface State {
  llA: LatLng | null
  llB: LatLng | null
  results: string[]
}

const module: Module<State, RootState> = {
  state: {
    llA: null,
    llB: null,
    results: [],
  },

  actions: {
    query({ commit }, { llA, llB }: {llA: LatLng, llB: LatLng}) {
      api.recorridos
        .get(llA.lng, llA.lng, llB.lng, llB.lat)
        .then(results => commit('setResults', results))
    },
    clickMap({ commit, state, dispatch }, latlng: LatLng) {
      if (state.llA) {
        commit('setllB', latlng)
        dispatch('query', { llA: state.llA, llB: latlng })
      } else {
        commit('setllA', latlng)
      }
    },
  },

  mutations: {
    setResults(state, results) {
      state.results = results
    },
    setllA(state, ll: LatLng) {
      state.llA = ll
    },
    setllB(state, ll: LatLng) {
      state.llB = ll
    },
  },

  getters: {
    results(state) {
      return state.results
    },
    getFirstRecorrido({ results }: { results: any[] }) {
      if (results.length === 0 || results[0].itinerario.length === 0) {
        return []
      }
      return geobufToLatlngs(results[0].itinerario[0].ruta_corta)
    },
    llA(state) {
      return state.llA
    },
    llB(state) {
      return state.llB
    },
  },
}
export default module
