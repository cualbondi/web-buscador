import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocationObservable, checkGeolocationPermission } from '@/utils'

interface State {
  geolocation: Coordinates | null
  geolocationPermission: string
}

const module: Module<State, RootState> = {
  state: {
    geolocation: null,
    geolocationPermission: 'prompt',
  },
  actions: {
    geolocate({ commit, dispatch }) {
      return geolocationObservable
        .takeFirst()
        .then(latlng => {
          commit('setGeolocation', latlng)
          return latlng
        })
        .catch(e => {
          dispatch('message', 'No se pudo acceder a la geolocalizacion')
          console.error(e)
        })
    },
    initGeolocation({ commit, dispatch }) {
      checkGeolocationPermission(status => {
        commit('setGeolocationPermission', status)
        dispatch('startWatchingGeolocation')
      })
    },
    startWatchingGeolocation({ dispatch, commit, state }) {
      if (state.geolocationPermission === 'granted') {
        dispatch('watchGeolocation')
      } else {
        geolocationObservable.stop()
        commit('setGeolocation', null)
      }
    },
    watchGeolocation({ commit, dispatch }) {
      geolocationObservable.addListener(position =>
        commit('setGeolocation', position),
      )
    },
  },
  mutations: {
    setGeolocation(state, geolocation: Coordinates) {
      state.geolocation = geolocation
    },
    setGeolocationPermission(state, status: string) {
      state.geolocationPermission = status
    },
  },
  getters: {
    geolocation(state) {
      return state.geolocation
    },
  },
}
export default module
