<template>
  <div class="mapContainer">
    <l-map :zoom="11" :center="center" @click="onClick">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-polyline :latLngs="recorrido" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity"></l-polyline>
      <polylinedecorator :patterns="patterns" :paths="[recorrido]"></polylinedecorator>
      <l-polyline :latLngs="recorrido" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity"></l-polyline>
      <l-marker v-if="llA" :latLng="llA" :icon="icon"/>
      <l-marker v-if="llB" :latLng="llB" :icon="icon"/>
    </l-map>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-polylinedecorator'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'

import iconUrl from '@/assets/marker-icon.png'
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
const decoratorArrow1 = decoratorBuilder('42', 0.5)
const decoratorArrow2 = decoratorBuilder('50', 0.7)
const decoratorArrow3 = decoratorBuilder('58', 0.9)

interface MapClickEvent {
  latlng: {
    lat: number,
    lng: number,
  }
}

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    Polylinedecorator,
  },
})
export default class Map extends Vue {
  public center = L.latLng(-34.9205, -57.953646)

  public backPolyStyle = {
    color: '#555',
    opacity: 0.9,
    weight: 10,
  }

  public polyStyle = {
    color: '#4285f4',
    opacity: 0.9,
    weight: 8,
  }

  public patterns = [
    decoratorArrow1,
    decoratorArrow2,
    decoratorArrow3,
  ]

  public icon = L.icon(Object.assign({},
    L.Icon.Default.prototype.options,
    {iconUrl, shadowUrl},
  ))

  get recorrido() {
    return this.$store.getters.getFirstRecorrido
  }
  get llA() {
    return this.$store.getters.llA
  }
  get llB() {
    return this.$store.getters.llB
  }
  public onClick(e: MapClickEvent) {
    this.$store.dispatch('clickMap', e.latlng)
  }
}
</script>


<style lang="scss" scoped>
  @import "~leaflet/dist/leaflet.css";
  .mapContainer {
    height: 100%;
  }
</style>
<style lang="scss">
  .osmTileLayer {
    opacity: 0.9 !important;
    filter: saturate(90%);
  }
</style>
