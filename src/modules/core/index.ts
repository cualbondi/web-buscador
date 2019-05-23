import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocationObservable, checkGeolocationPermission } from '@/utils'
import CIUDADES from '@/ciudades'

interface Ciudad {
  slug: string
  nombre: string
  latlng: [number]
  zoom: number
}

const CS: Ciudad[] = CIUDADES

interface State {
  geolocation: Coordinates | null
  geolocationPermission: string
  ciudad: Ciudad | null
}

const module: Module<State, RootState> = {
  state: {
    geolocation: null,
    geolocationPermission: 'prompt',
    ciudad: null,
  },
  actions: {
    setCiudad({ commit }, slug: string) {
      // slug can be a slug of a city or a slug plus "|" plus coordinates.
      // ex. slug: "la-plata"
      // ex. with geo: "villa-dominico|-57.23,-48.3423"
      let ciudad = CS.find(c => c.slug === slug)
      if (!ciudad && slug.includes('|')) {
        const parts = slug.split('|')
        try {
          ciudad = {
            slug: parts[0],
            nombre: parts[0],
            latlng: parts[1].split(',').map(n => parseFloat(n)) as [number],
            zoom: 12,
          }
        } catch (e) {
          console.log('ERROR, NO SE PUDO PARSEAR CIUDAD!')
          console.log(e)
          ciudad = CS[0]
        }
      }
      commit('setCiudad', ciudad)
    },
    // geolocate promise that can be resolved from cache
    geolocate({ commit, dispatch }) {
      return geolocationObservable.takeFirst().catch(e => {
        dispatch('message', 'No se pudo acceder a la geolocalizacion')
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
    setCiudad(state, ciudad: Ciudad) {
      state.ciudad = ciudad
    },
    setGeolocation(state, geolocation: Coordinates) {
      state.geolocation = geolocation
    },
    setGeolocationPermission(state, status: string) {
      state.geolocationPermission = status
    },
  },
  getters: {
    getCiudad(state) {
      return state.ciudad
    },
    getCiudades(state) {
      return CIUDADES
    },
    getCiudadLatlng(state) {
      return state.ciudad && state.ciudad.latlng
    },
    getCiudadNombre(state) {
      return state.ciudad && state.ciudad.nombre
    },
    getCiudadZoom(state) {
      return state.ciudad && state.ciudad.zoom
    },
    geolocation(state) {
      return state.geolocation
    },
  },
}
export default module
