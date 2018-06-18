import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/api'
import { Recorrido } from '@/api/schema'

interface LatLng {
  lat: number
  lng: number
  type: 'latlng'
}

interface Geolocation {
  type: 'geolocation'
}

export interface GeocoderResult {
  lat: number
  lng: number
  type: 'geocoder'
  name: string
}

export type Location = LatLng | Geolocation | GeocoderResult

interface State {
  A: Location | null
  B: Location | null
  results: Recorrido[]
  radius: number
  resultSelected: number
  resultsLoading: boolean
  resultsPage: number
  resultsMore: boolean
  resultsMoreLoading: boolean
}

const module: Module<State, RootState> = {
  state: {
    A: null,
    B: null,
    radius: 300,
    results: [],
    resultSelected: 0,
    resultsLoading: false,
    resultsPage: 1,
    resultsMore: true,
    resultsMoreLoading: false,
  },

  actions: {
    async getAB({ dispatch, state }) {
      if (!state.A || !state.B) {
        return
      }
      let lngA
      let latA
      let lngB
      let latB
      if (state.A.type === 'geolocation') {
        const latlngA = await dispatch('geolocate')
        lngA = latlngA.longitude
        latA = latlngA.latitude
      } else {
        lngA = state.A.lng
        latA = state.A.lat
      }
      if (state.B.type === 'geolocation') {
        const latlngB = await dispatch('geolocate')
        lngB = latlngB.longitude
        latB = latlngB.latitude
      } else {
        lngB = state.B.lng
        latB = state.B.lat
      }
      return { lngA, latA, lngB, latB }
    },
    async query({ dispatch, commit, state }) {
      if (!state.A || !state.B) {
        return
      }
      const { lngA, latA, lngB, latB } = await dispatch('getAB')
      const params = {
        lngA,
        latA,
        lngB,
        latB,
        rad: state.radius,
        page: state.resultsPage,
      }
      try {
        const data = await api.recorridos(params)
        if (data.next) {
          commit('setResultsMore', false)
        }
        commit('setResults', data.results)
      } catch (err) {
        // TODO: handle api error
      } finally {
        commit('finishLoadingResults')
      }
    },
    async getNextPage({ commit, state, dispatch }) {
      commit('startLoadingMoreResults')
      if (!state.A || !state.B) {
        return
      }
      const { lngA, latA, lngB, latB } = await dispatch('getAB')
      const params = {
        lngA,
        latA,
        lngB,
        latB,
        rad: state.radius,
        page: state.resultsPage + 1,
      }
      try {
        const data = await api.recorridos(params)
        if (data.next) {
          commit('setResultsMore', true)
        }
        commit('appendResults', data.results)
      } catch (err) {
        // TODO: handle api error
      } finally {
        commit('finishLoadingMoreResults')
      }
    },
    clickMap({ commit, state, dispatch }, ll: LatLng) {
      if (state.A === null) {
        commit('setA', ll)
      } else if (state.B === null) {
        commit('setB', ll)
        dispatch('query')
      }
    },
    setA({ commit, dispatch }, ll: LatLng) {
      commit('setA', ll)
      dispatch('query')
    },
    setB({ commit, dispatch }, ll: LatLng) {
      commit('setB', ll)
      dispatch('query')
    },
    setRadius({ state, commit, dispatch }, meters: number) {
      if (state.radius === meters) {
        return
      }
      commit('setRadius', meters)
      dispatch('query')
    },
    async setRecorridoSelectedIndex(
      { state, commit, dispatch },
      index: number,
    ) {
      if (index < state.results.length) {
        commit('setRecorridoSelectedIndex', index)
      } else if (state.resultsMore) {
        await dispatch('getNextPage')
        commit('setRecorridoSelectedIndex', index)
      }
    },
    fromGeoLocation({ dispatch, commit }, source: 'origin' | 'destination') {
      dispatch('geolocate')
      const ll = {
        type: 'geolocation',
      }
      if (source === 'origin') {
        return dispatch('setA', ll)
      } else {
        return dispatch('setB', ll)
      }
    },
    fromGeocoder(
      { dispatch },
      {
        source,
        result,
      }: { source: 'origin' | 'destination'; result: GeocoderResult },
    ) {
      if (source === 'origin') {
        return dispatch('setA', result)
      } else {
        return dispatch('setB', result)
      }
    },
    swapAB({ commit, state, dispatch }) {
      const A = state.A
      const B = state.B
      commit('setA', B)
      commit('setB', A)
      dispatch('query')
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
    setA(state, ll: Location) {
      state.A = ll
    },
    setB(state, ll: Location) {
      state.B = ll
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
    A(state) {
      return state.A
    },
    B(state) {
      return state.B
    },
    radius(state) {
      return state.radius
    },
  },
}

export default module
