<template>
  <div class="map-location-picker">
    <l-map :zoom="11" :center="center" @click="onClick" ref="mapRef" :options="options">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-editablecirclemarker v-if="llA" :latLng.sync="llA" :rad="300" :options="{icon}" />
    </l-map>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet-editablecirclemarker'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'

import iconUrl from '@/assets/marker-icon.png'
import iconRetinaUrl from '@/assets/marker-icon-2x.png'
import shadowUrl from '@/assets/marker-shadow.png'

const decoratorBuilder = function(offset: string, opacity: number) {
  return {
    offset,
    repeat: 150,
    symbol: L.Symbol.arrowHead({
      pixelSize: 6,
      polygon: false,
      pathOptions: {
        color: '#FFF',
        opacity,
        weight: 2,
      },
    }),
  }
}

@Component({
  components: {
    LMap,
    LTileLayer,
    LEditablecirclemarker,
  },
})
export default class Map extends Vue {
  public center = L.latLng(-34.9205, -57.953646)
  public options = {
    zoomControl: false,
  }

  public icon = L.icon(
    Object.assign({}, L.Icon.Default.prototype.options, {
      iconUrl,
      shadowUrl,
      iconRetinaUrl,
    }),
  )

  get llA() {
    return this.$store.getters.llA
  }
  set llA(val) {
    this.$store.dispatch('setllA', val)
  }
  public onClick(e: LeafletMouseEvent) {
    this.$store.dispatch('clickMap', e.latlng)
  }
}
</script>


<style lang="scss" scoped>
.map-location-picker {
  height: 100%;
}
</style>
