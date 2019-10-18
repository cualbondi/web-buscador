import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/api'
import { GeocoderResponse } from '@/api/schema'
import { recentResultsStore } from './storage'
interface State {
  results: GeocoderResponse[]
  loading: boolean
}

const module: Module<State, RootState> = {
  state: {
    results: [],
    loading: false,
  },
  actions: {
    geocoderClearResults({ commit }) {
      commit('geocoderClearResults')
    },
    geocode({ commit, getters, dispatch }, query) {
      const ciudadSlug = getters.getCiudad.slug
      commit('setLoading', true)
      return api.geocoder_result(query, ciudadSlug, undefined).then(results => {
        dispatch('logGeocoderResult', { query, results })
        commit('setGeocoderResults', results)
      })
    },
    logGeocoderResult({ commit }, { query, results }) {
      recentResultsStore.store({query, results, timestamp: Date.now()})
    },
    fromCache({commit}, prevSearch) {
      commit('setGeocoderResults', prevSearch.results)
    }
  },
  mutations: {
    setLoading(state, value: boolean) {
      state.loading = value
    },
    geocoderClearResults(state) {
      state.results = []
    },
    setGeocoderResults(state, results: GeocoderResponse[]) {
      state.results = results
      state.loading = false
    },
  },
  getters: {
    getGeocoderLoading(state) {
      return state.loading
    },
    geocoderResults(state) {
      return state.results
    },
    prevGeocoderResults(state){
      return recentResultsStore.top()
    }
  },
}
export default module
