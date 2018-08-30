import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/api'
import { GeocoderResponse } from '@/api/schema'

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
    geocoderClearResults({commit}) {
      commit('geocoderClearResults')
    },
    geocode({ commit, getters }, query) {
      const ciudadSlug = getters.getCiudad.slug
      commit('setLoading', true)
      return api.geocoder_result(query, ciudadSlug, undefined).then(results => {
        commit('setGeocoderResults', results)
      })
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
  },
  getters: {
    getGeocoderLoading(state) {
      return state.loading
    },
    geocoderResults(state) {
      return state.results
    },
  },
}
export default module
