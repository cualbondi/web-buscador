import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/api'
import { GeocoderResponse } from '@/api/schema'

interface State {
  results: GeocoderResponse[]
}

const module: Module<State, RootState> = {
  state: {
    results: [],
  },
  actions: {
    geocode({ commit }, query) {
      return api.geocoder(query).then(results => {
        commit('setGeocoderResults', results)
      })
    },
  },
  mutations: {
    setGeocoderResults(state, results: GeocoderResponse[]) {
      state.results = results
    },
  },
  getters: {
    geocoderResults(state) {
      return state.results
    },
  },
}
export default module
