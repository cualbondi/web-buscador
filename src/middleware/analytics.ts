/* tslint:disable:no-console */

import vueInstance from '@/main'
import { isProd } from '@/config'
import { Store } from 'vuex'
import { RootState } from '@/store'
import Vue from 'vue'

export default (store: Store<RootState>) => {
  store.subscribe((mutation, state) => {
    if (!mutation.payload) {
      return
    }

    let d = [mutation.type]

    switch (mutation.type) {
      case 'setllA': d = ['map', 'setll', 'A']; break
      case 'setllB': d = ['map', 'setll', 'B']; break
      case 'clickMap': d = ['map', 'click']; break
      case 'setRadius': d = ['menu', 'setRadius', 'AB', mutation.payload]; break
    }

    if (d[0] && d[1]) {
      vueInstance.$ga.event({
        eventCategory: d[0],
        eventAction: d[1],
        eventLabel: d[2],
        eventValue: d[3],
      })
    } else {
      if (!isProd) {
        console.warn('action not tracked', mutation)
      }
    }

  })
}
