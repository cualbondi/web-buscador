import { Module } from 'vuex'
import { LatLng } from 'leaflet'
import { RootState } from '@/store'
import api from '@/api/api'
import { Recorrido } from '@/api/schema'

interface State {
  llA: LatLng | null
  llB: LatLng | null
  radius: number
  results: Recorrido[]
  resultSelected: number
  resultsLoading: boolean
  resultsPage: number
  resultsMore: boolean
  resultsMoreLoading: boolean
}

const module: Module<State, RootState> = {
  state: {
    llA: null,
    llB: null,
    radius: 300,
    results: [],
    resultSelected: 0,
    resultsLoading: false,
    resultsPage: 1,
    resultsMore: true,
    resultsMoreLoading: false,
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
            state.resultsPage,
          )
          .then(
            results => {
              if (results.length < 5) {
                commit('setResultsMore', false)
              }
              commit('setResults', results)
            }
          )
          // .catch(err => notification?)
          .then(data => commit('finishLoadingResults'))
      }
    },
    getNextPage({ commit, state, dispatch }) {
      commit('startLoadingMoreResults')
      return new Promise((resolve, reject) => {
        if (state.llA && state.llB) {
          api
            .recorridos(
              state.llA.lng,
              state.llA.lat,
              state.llB.lng,
              state.llB.lat,
              state.radius,
              state.resultsPage + 1,
            )
            .then(
              results => {
                commit('appendResults', results)
                commit('finishLoadingMoreResults')
                if (results.length === 5) {
                  commit('setResultsMore', true)
                }
                resolve(results.length)
              }
            )
            .catch(() => {
              commit('finishLoadingMoreResults')
            })
        }
      })
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
    setRecorridoSelectedIndex({ state, commit, dispatch }, index: number) {
      if (index < state.results.length ) {
        commit('setRecorridoSelectedIndex', index)
      } else {
        if (state.resultsMore) {
          dispatch('getNextPage').then(count => {
            if (count > 0) {
              commit('setRecorridoSelectedIndex', index)
            }
          })
        }
      }
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
      state.resultsPage = 1
      state.resultsMore = false
    },
    finishLoadingResults(state) {
      state.resultsLoading = false
    },
    setResults(state, results: Recorrido[]) {
      state.results = results
      state.resultSelected = 0
      state.resultsMore = true
    },
    setRecorridoSelectedIndex(state, index: number) {
      if (index < state.results.length && index > -1) {
        state.resultSelected = index
      }
    },
    setResultsMore(state, val: boolean) {
      state.resultsMore = val
    },
    startLoadingMoreResults(state) {
      state.resultsMore = false
      state.resultsMoreLoading = true
    },
    appendResults(state, results: Recorrido[]) {
      state.results.push(...results)
      state.resultsPage += 1
    },
    finishLoadingMoreResults(state) {
      state.resultsMoreLoading = false
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
    getResultsMore(state) {
      return state.resultsMore
    },
    getResultsMoreLoading(state) {
      return state.resultsMoreLoading
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
