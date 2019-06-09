import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/api'
import { Recorrido } from '@/api/schema'
import router from '@/router'

interface State {
  searchString: string
  results: Recorrido[]
  resultSelected: number
  resultsLoading: boolean
  resultsPage: number
  resultsMore: boolean
  resultsMoreLoading: boolean
  searchRequested: boolean
  apiError: boolean
}

const module: Module<State, RootState> = {
  state: {
    searchString: '',
    results: [],
    resultSelected: 0,
    resultsLoading: false,
    resultsPage: 1,
    resultsMore: true,
    resultsMoreLoading: false,
    searchRequested: false,
    apiError: false,
  },

  actions: {
    setSearchStringSearchBus({ commit }, searchString: string) {
      commit('setSearchStringSearchBus', searchString)
    },
    searchBus({ dispatch, commit, state, getters }) {
      if (!state.searchString) {
        return
      }
      dispatch('searchRequestedSearchBus')
      commit('startLoadingResultsSearchBus')
      commit('setApiErrorSearchBus', false)
      const ciudadSlug = getters.getCiudad.slug
      const searchString = getters.getSearchStringSearchBus
      const params = {
        query: searchString,
        page: state.resultsPage,
        ciudadSlug,
      }
      api.recorridosSearch(params)
        .then((data: any) => {
          if (data.next) {
            commit('setResultsMoreSearchBus', true)
          }
          commit('setResultsSearchBus', data.results)
        })
        .catch((err: any) => {
          dispatch('setApiErrorSearchBus')
          console.log(err)
        })
        .finally(() =>
          commit('finishLoadingResultsSearchBus'),
        )
    },
    // TODO: the following method could just use the one above
    async getNextPageSearchBus({ commit, state, dispatch, getters }) {
      if (!state.searchString) {
        return
      }
      commit('startLoadingMoreResultsSearchBus')
      commit('setApiErrorSearchBus', false)
      const ciudadSlug = getters.getCiudad.slug
      const searchString = getters.getSearchStringSearchBus
      const params = {
        query: searchString,
        page: state.resultsPage + 1,
        ciudadSlug,
      }
      api.recorridosSearch(params)
        .then((data: any) => {
          if (data.next) {
            commit('setResultsMoreSearchBus', true)
          }
          commit('appendResultsSearchBus', data.results)
        })
        .catch((err: any) => {
          dispatch('setApiErrorSearchBus')
          console.log(err)
        })
        .finally(() =>
          commit('finishLoadingMoreResultsSearchBus'),
        )
    },
    async setRecorridoSelectedIndexSearchBus(
      { state, commit, dispatch },
      index: number,
    ) {
      if (index < state.results.length) {
        commit('setRecorridoSelectedIndexSearchBus', index)
      } else if (state.resultsMore) {
        await dispatch('getNextPageSearchBus')
        commit('setRecorridoSelectedIndexSearchBus', index)
      }
    },
    searchRequestedSearchBus({ commit, state }) {
      if (!state.searchRequested) {
        commit('setSearchRequestedSearchBus')
      }
    },
    setApiErrorSearchBusSearchBus({ commit, dispatch }) {
      dispatch('message', 'Hubo un error al comunicarse con el servidor')
      commit('setApiErrorSearchBus', true)
    },
  },

  mutations: {
    setSearchRequestedSearchBus(state) {
      state.searchRequested = true
    },
    startLoadingResultsSearchBus(state) {
      state.resultsLoading = true
      state.results = []
      state.resultsPage = 1
      state.resultsMore = false
    },
    finishLoadingResultsSearchBus(state) {
      state.resultsLoading = false
    },
    setResultsSearchBus(state, results: Recorrido[]) {
      state.results = results
      state.resultSelected = 0
    },
    setRecorridoSelectedIndexSearchBus(state, index: number) {
      if (index < state.results.length && index > -1) {
        state.resultSelected = index
      }
    },
    setResultsMoreSearchBus(state, val: boolean) {
      state.resultsMore = val
    },
    startLoadingMoreResultsSearchBus(state) {
      state.resultsMore = false
      state.resultsMoreLoading = true
    },
    appendResultsSearchBus(state, results: Recorrido[]) {
      state.results.push(...results)
      state.resultsPage += 1
    },
    finishLoadingMoreResultsSearchBus(state) {
      state.resultsMoreLoading = false
    },
    setSearchStringSearchBus(state, searchString: string) {
      state.searchString = searchString
    },
    setApiErrorSearchBus(state, value) {
      state.apiError = value
    },
  },
  getters: {
    apiErrorSearchBus(state) {
      return state.apiError
    },
    searchRequestedSearchBus(state) {
      return state.searchRequested
    },
    getRecorridosSearchBus(state) {
      return state.results
    },
    getRecorridoSelectedIndexSearchBus(state) {
      return state.resultSelected
    },
    getRecorridoSelectedSearchBus(state) {
      return state.results[state.resultSelected]
    },
    getRecorridosLoadingSearchBus(state) {
      return state.resultsLoading
    },
    getResultsMoreSearchBus(state) {
      return state.resultsMore
    },
    getResultsMoreLoadingSearchBus(state) {
      return state.resultsMoreLoading
    },
    hasNextResultSearchBus(state) {
      if (state.resultSelected === state.results.length - 1) {
        return state.resultsMore
      }
      return state.resultSelected < state.results.length - 1
    },
    hasPrevResultSearchBus(state) {
      return !(state.resultSelected === 0)
    },
    getSearchStringSearchBus(state): string {
      return state.searchString
    },
  },
}

export default module
