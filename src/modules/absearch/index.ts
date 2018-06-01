import { Module } from 'vuex'
import { LatLng } from 'leaflet'
import { RootState } from '@/store'
import { geobufToLatlngs } from '@/utils'
import api from '@/api/api'
import { Recorrido } from '@/api/schema'

interface State {
  llA: LatLng | null
  llB: LatLng | null
  results: Recorrido[]
  radius: number
  resultSelected: number
  resultsLoading: boolean
}

const module: Module<State, RootState> = {
  state: {
    llA: null,
    llB: null,
    radius: 300,
    results: [],
    resultSelected: 0,
    resultsLoading: false,
  },

  actions: {
    query({ commit, state }) {
      if (state.llA && state.llB) {
        commit('startLoadingResults')
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
          // .catch(err => notification?)
          .then(data => commit('finishLoadingResults'))
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
    startLoadingResults(state) {
      state.resultsLoading = true
      state.results = []
    },
    finishLoadingResults(state) {
      state.resultsLoading = false
    },
    setResults(state, results: Recorrido[]) {
      state.results = results
      state.resultSelected = 0
    },
    setRecorridoSelectedIndex(state, index: number) {
      state.resultSelected = index
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
    getRecorridos(state) {
      return state.results
    },
    getRecorridoSelectedIndex(state) {
      return state.resultSelected
    },
    getRecorridoSelected(state) {
      return state.results[state.resultSelected]
    },
    getRecorridosLoading(state) {
      return state.resultsLoading
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
