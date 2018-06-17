import { Module } from 'vuex'
import { RootState } from '@/store'
import { geolocationObservable, checkGeolocationPermission } from '@/utils'

interface Ciudad {
  slug: string
  nombre: string
  latlng: [number]
  zoom: number
}

interface State {
  geolocation: Coordinates | null
  geolocationPermission: string
  ciudad: Ciudad
}

export const CIUDADES = [
  { slug: 'bahia-blanca', nombre: 'Bahía Blanca', latlng: [-38.71712603942564, -62.26758956909179], zoom: 13 },
  { slug: 'buenos-aires', nombre: 'Buenos Aires', latlng: [-34.61060576091466, -58.38821411132812], zoom: 12 },
  { slug: 'cordoba', nombre: 'Córdoba', latlng: [-31.41672448645413, -64.18350219726561], zoom: 13 },
  { slug: 'la-plata', nombre: 'La Plata', latlng: [-34.92137284339113, -57.95438289642334], zoom: 14 },
  { slug: 'mar-del-plata', nombre: 'Mar del Plata', latlng: [-38.00353496501491, -57.55290985107422], zoom: 13 },
  { slug: 'mendoza', nombre: 'Mendoza', latlng: [-32.88960597084806, -68.84445190429688], zoom: 14 },
  { slug: 'rosario', nombre: 'Rosario', latlng: [-32.94350062291001, -60.64985275268555], zoom: 14 },
  { slug: 'salta', nombre: 'Salta', latlng: [-24.78924754938909, -65.41031241416931], zoom: 14 },
  { slug: 'santa-fe', nombre: 'Santa Fé', latlng: [-31.64189163095992, -60.70441961288452], zoom: 13 },
]

const module: Module<State, RootState> = {
  state: {
    geolocation: null,
    geolocationPermission: 'prompt',
    ciudad: null,
  },
  actions: {
    setCiudad({ commit }, slug) {
      const ciudad = CIUDADES.find(c => c.slug === slug)
      commit('setCiudad', ciudad)
    },
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
    getCiudadLatlng(state) {
      return state.ciudad && state.ciudad.latlng
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
