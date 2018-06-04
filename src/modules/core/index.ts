import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocate, Coordinates, checkGeolocationPermission } from '@/utils'

interface State {
  geolocation: Coordinates | null
  geolocationPermission: string
  watchGeolocationId: number | null
}

const module: Module<State, RootState> = {
  state: {
    geolocation: null,
    geolocationPermission: 'prompt',
    watchGeolocationId: null,
  },
  actions: {
    geolocate({ commit, dispatch }) {
      return geolocate()
        .then(latlng => {
          commit('setGeolocation', latlng)
          return latlng
        })
        .catch((e) => {
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
    startWatchingGeolocation({dispatch, commit, state}) {
      if (state.geolocationPermission === 'granted') {
        dispatch('watchGeolocation')
      } else {
        dispatch('clearWatchId')
        commit('setGeolocation', null)
      }
    },

    watchGeolocation({ commit, dispatch }) {
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          position =>
            commit('setGeolocation', {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              precision: position.coords.accuracy,
            }),
          err => console.error(err),
          { enableHighAccuracy: true, maximumAge: 2000 },
        )
        commit('setWatchGeolocationId', id)
      }
    },

    clearWatchId({ commit, dispatch, state }) {
      if (state.watchGeolocationId) {
        navigator.geolocation.clearWatch(state.watchGeolocationId)
      }
    },
  },
  mutations: {
    setGeolocation(state, geolocation: Coordinates) {
      console.log(geolocation)
      state.geolocation = geolocation
    },
    setGeolocationPermission(state, status: string) {
      state.geolocationPermission = status
    },
    setWatchGeolocationId(state, id: number) {
      state.watchGeolocationId = id
    },
  },
  getters: {
    geolocation(state) {
      return state.geolocation
    },
  },
}
export default module
