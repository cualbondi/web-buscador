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
      return geolocationObservable.takeFirst().catch(e => {
        dispatch('message', 'No se pudo acceder a la geolocalizacion')
        console.error(e)
        return Promise.reject(e)
      })
    },
    initGeolocation({ commit, dispatch }) {
      // add a hook to geolocation permission to save the state and start/stop watching
      checkGeolocationPermission(status => {
        commit('setGeolocationPermission', status)
        if (status === 'granted') {
          geolocationObservable.start()
        } else {
          geolocationObservable.stop()
          commit('setGeolocation', null)
        }
      })
      // add the listener to get position updates
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
