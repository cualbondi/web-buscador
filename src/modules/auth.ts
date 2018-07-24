import { Module } from 'vuex'
import { RootState } from '@/store'
import api from '@/api/auth'
import router from '@/router'


interface User {
  username: string
  permissions: [string]
  FBToken: string
}

interface State {
  user: User | null
  nextUrl: string | undefined
}

const module: Module<State, RootState> = {
  state: {
    user: null,
    nextUrl: undefined,
  },
  actions: {
    loginFB({ commit, state }) {
      window.FB.login((response: any) => {
        api.getUserFB(response.authResponse.accessToken)
          .then((u: any) => {
            commit('setUser', { ...u, FBToken: response.authResponse.accessToken})
            if (state.nextUrl) {
              const nextUrl = state.nextUrl
              state.nextUrl = undefined
              router.push({ name: nextUrl })
            }
          })
      })
    },
    setNextUrl({ commit }, nextUrl) {
      commit('setNextUrl', nextUrl)
    },
  },
  mutations: {
    setUser(state, user: User) {
      state.user = user
    },
    setNextUrl(state, nextUrl: string) {
      state.nextUrl = nextUrl
    }
  },
  getters: {
    getUser(state) {
      return state.user
    },
  },
}
export default module
