import { Module } from 'vuex'
import { LatLng } from 'leaflet'
import { RootState } from '@/store'
import { geobufToLatlngs } from '@/utils'
import api from '@/api'

interface State {
  llA: LatLng | null
  llB: LatLng | null
  results: string[]
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
        api.recorridos
          .get(state.llA.lng, state.llA.lat, state.llB.lng, state.llB.lat, state.radius)
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
      if ( state.radius == meters ) { return }
      commit('setRadius', meters)
      dispatch('query')
    },
    geolocate({ commit }) {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const lat = position.coords.latitude.toString()
              const lng = position.coords.longitude.toString()
              resolve({ lat, lng })
            },
            err => {
              reject(err)
            },
            { enableHighAccuracy: true },
          )
        } else {
          window.alert('Oops, your browser does not support geolocation')
          reject()
        }
      })
    },
    fromGeoLocation({ dispatch, commit }, source: 'origin' | 'destination') {
      return dispatch('geolocate').then(latlng => {
        if (source === 'origin') {
          return dispatch('setllA', latlng)
        } else {
          return dispatch('setllB', latlng)
        }
      })
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
    setRadius(state, meters: number) {
      state.radius = meters
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
    radius(state) {
      return state.radius
    },
  },
}

export default module
