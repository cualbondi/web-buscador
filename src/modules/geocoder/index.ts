import { Module } from 'vuex'
import { RootState } from '@/plugins/store'
import api from '@/api/api'
import { GeocoderResponse } from '@/api/schema'
import { persistentStorage, RecentGeocoderResults } from '@/storage'

interface State {
  results: GeocoderResponse[]
  loading: boolean
  topPrevGeocoderQueries: RecentGeocoderResults[]
}

const module: Module<State, RootState> = {
  state: {
    results: [],
    loading: false,
    topPrevGeocoderQueries: persistentStorage.topQueries(),
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
      persistentStorage.logQuery({ query, results, timestamp: Date.now() })
      commit('setTopPrevGeocoderQueries')
    },
    fromCache({ commit }, prevSearch) {
      commit('setGeocoderResults', prevSearch.results)
    },
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
    setTopPrevGeocoderQueries(state) {
      state.topPrevGeocoderQueries = persistentStorage.topQueries()
    },
  },
  getters: {
    getGeocoderLoading(state) {
      return state.loading
    },
    geocoderResults(state) {
      return state.results
    },
    prevGeocoderResults(state) {
      return state.topPrevGeocoderQueries
    },
  },
}
export default module
