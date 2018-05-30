/* tslint:disable:no-console */

import vueInstance from './main'
import { isProd } from '@/config'

export default (store: any) => {
  store.subscribe((mutation: any, state: any) => {
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
      (vueInstance as any).$ga.event({
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
