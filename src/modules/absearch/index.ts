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

interface LatLngGeolocation extends Geolocation {
  lat: number | null
  lng: number | null
}

export interface GeocoderResult {
  lat: number
  lng: number
  type: 'geocoder'
  name: string
}

export type Location = LatLng | Geolocation | GeocoderResult | null
export type LatLngLocation = LatLng | LatLngGeolocation | GeocoderResult | null

interface State {
  A: Location
  B: Location
  results: Recorrido[]
  radius: number
  resultSelected: number
  resultsLoading: boolean
  resultsPage: number
  resultsMore: boolean
  resultsMoreLoading: boolean
  searchRequested: boolean
  transbordo: boolean
  apiError: boolean
  geolocationError: boolean
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
    searchRequested: false,
    transbordo: false,
    apiError: false,
    geolocationError: false,
  },

  actions: {
    async getAB({ state, dispatch, getters }) {
      if (state.A === null || state.B === null) {
        return
      }
      // we need to resolve geolocation before querying
      if (state.A.type === 'geolocation' || state.B.type === 'geolocation') {
        await dispatch('geolocate')
      }
      const A = getters.A
      const B = getters.B
      return { lngA: A.lng, latA: A.lat, lngB: B.lng, latB: B.lat }
    },
    async query({ dispatch, commit, state, getters }) {
      if (!state.A || !state.B) {
        return
      }
      dispatch('searchRequested')
      commit('startLoadingResults')
      commit('setApiError', false)
      commit('setGeolocationError', false)
      try {
        var { lngA, latA, lngB, latB } = await dispatch('getAB')
      } catch {
        dispatch('setGeolocationError')
        commit('finishLoadingResults')
        return
      }
      const ciudadSlug = getters.getCiudad.slug
      const params = {
        lngA,
        latA,
        lngB,
        latB,
        rad: state.radius,
        page: state.resultsPage,
        ciudadSlug,
        transbordo: state.transbordo,
      }
      try {
        const data = await api.recorridos(params)
        if (data.next) {
          commit('setResultsMore', false)
        }
        commit('setResults', data.results)
      } catch (err) {
        dispatch('setApiError')
      } finally {
        commit('finishLoadingResults')
      }
    },
    // TODO: the following method could just use the one above
    async getNextPage({ commit, state, dispatch, getters }) {
      if (!state.A || !state.B) {
        return
      }
      commit('startLoadingMoreResults')
      commit('setApiError', false)
      const { lngA, latA, lngB, latB } = await dispatch('getAB')
      const ciudadSlug = getters.getCiudad.slug
      const params = {
        lngA,
        latA,
        lngB,
        latB,
        rad: state.radius,
        page: state.resultsPage + 1,
        ciudadSlug,
        transbordo: state.transbordo,
      }
      try {
        const data = await api.recorridos(params)
        if (data.next) {
          commit('setResultsMore', true)
        }
        commit('appendResults', data.results)
      } catch (err) {
        dispatch('setApiError')
      } finally {
        commit('finishLoadingMoreResults')
      }
    },
    clickMap({ commit, state, dispatch }, ll: Location) {
      if (state.A === null) {
        commit('setA', ll)
      } else if (state.B === null) {
        commit('setB', ll)
        commit('setTransbordo', false)
        dispatch('query')
      }
    },
    setA({ commit, dispatch }, ll: Location) {
      commit('setA', ll)
      commit('setTransbordo', false)
      dispatch('query')
    },
    setB({ commit, dispatch }, ll: Location) {
      commit('setB', ll)
      commit('setTransbordo', false)
      dispatch('query')
    },
    setRadius({ state, commit, dispatch }, meters: number) {
      if (state.radius === meters) {
        return
      }
      commit('setRadius', meters)
      commit('setTransbordo', false)
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
    // sets A or B from geolocation
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
    setTransbordo({ commit }, value) {
      commit('setTransbordo', value)
    },
    // sets A or B from a geocoder result
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
      commit('setTransbordo', false)
      dispatch('query')
    },
    searchRequested({ commit, state }) {
      if (!state.searchRequested) {
        commit('setSearchRequested')
      }
    },
    setApiError({commit, dispatch}){
      dispatch('message', 'Hubo un error al comunicarse con el servidor')
      commit('setApiError', true)
    },
    setGeolocationError({commit, dispatch}){
      dispatch('message', 'No se pudo acceder a tu ubicación')
      commit('setGeolocationError', true)
    },
  },

  mutations: {
    setSearchRequested(state) {
      state.searchRequested = true
    },
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
    setTransbordo(state, value: boolean) {
      state.transbordo = value
    },
    setApiError(state, value){
      state.apiError = value
    },
    setGeolocationError(state, value){
      state.geolocationError = value
    },
  },
  getters: {
    geolocationError(state){
      return state.geolocationError
    },
    apiError(state){
      return state.apiError
    },
    searchRequested(state) {
      return state.searchRequested
    },
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
    hasNextResult(state) {
      return (
        state.resultsMore || state.resultSelected < state.results.length - 1
      )
    },
    hasPrevResult(state) {
      return !(state.resultSelected === 0)
    },
    // extends A or B so they have geolocation info if available
    A(state, rootState): LatLngLocation {
      const geolocation: Coordinates = rootState.geolocation
      if (state.A === null) {
        return null
      }
      if (state.A.type === 'geolocation') {
        return {
          ...state.A,
          lat: geolocation ? geolocation.latitude : null,
          lng: geolocation ? geolocation.longitude : null,
        }
      }
      return state.A
    },
    B(state, rootState): LatLngLocation {
      const geolocation: Coordinates = rootState.geolocation
      if (state.B === null) {
        return null
      }
      if (state.B.type === 'geolocation') {
        return {
          ...state.B,
          lat: geolocation ? geolocation.latitude : null,
          lng: geolocation ? geolocation.longitude : null,
        }
      }
      return state.B
    },
    radius(state) {
      return state.radius
    },
    transbordo(state) {
      return state.transbordo
    },
  },
}

export default module
