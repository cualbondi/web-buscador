import { Module } from 'vuex'
import { RootState } from '@/store'
import { geobufToLatlngs } from '@/utils'
import api from '@/api/api'
import { Recorrido } from '@/api/schema'

interface LatLng {
  lat: number
  lng: number
}

interface State {
  llA: LatLng | null
  llB: LatLng | null
  results: Recorrido[]
  radius: number
}

const module: Module<State, RootState> = {
  state: {
    llA: null,
    llB: null,
    results: [],
    radius: 300,
  },

  actions: {
    query({ commit, state }) {
      if (state.llA && state.llB) {
        api
          .recorridos(
            state.llA.lng,
            state.llA.lat,
            state.llB.lng,
            state.llB.lat,
            state.radius,
          )
          .then(data => data.results)
          .then(results => commit('setResults', results))
      }
    },
    clickMap({ commit, state, dispatch }, ll: LatLng) {
      if (!state.llA) {
        commit('setllA', ll)
      } else {
        if (!state.llB) {
          commit('setllB', ll)
          dispatch('query')
        }
      }
    },
    setllA({ commit, dispatch }, ll: LatLng) {
      commit('setllA', ll)
      dispatch('query')
    },
    setllB({ commit, dispatch }, ll: LatLng) {
      commit('setllB', ll)
      dispatch('query')
    },
    setRadius({ state, commit, dispatch }, meters: number) {
      if (state.radius === meters) {
        return
      }
      commit('setRadius', meters)
      dispatch('query')
    },
    fromGeoLocation({ dispatch, commit, state }, source: 'origin' | 'destination') {
      return dispatch('geolocate').then(latlng => {
        const ll = {lat: latlng.latitude, lng: latlng.longitude}
        if (source === 'origin') {
          return dispatch('setllA', ll)
        } else {
          return dispatch('setllB', ll)
        }
      })
    },
  },

  mutations: {
    setResults(state, results: Recorrido[]) {
      state.results = results
    },
    setllA(state, ll: LatLng) {
      state.llA = ll
    },
    setllB(state, ll: LatLng) {
      state.llB = ll
    },
    setRadius(state, meters: number) {
      state.radius = meters
    },
  },

  getters: {
    results(state) {
      return state.results
    },
    getFirstRecorrido({ results }: { results: Recorrido[] }) {
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
    radius(state) {
      return state.radius
    },
  },
}


export default module
