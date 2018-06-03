<template>
  <div class="mapContainer">
    <l-map :zoom="11" :center="center" @click="onClick" :options="options">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-polyline :latLngs="recorrido" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity"></l-polyline>
      <polylinedecorator :patterns="patterns" :paths="[recorrido]"></polylinedecorator>
      <l-polyline :latLngs="recorrido" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity"></l-polyline>
      <l-editablecirclemarker v-if="llA" :latLng.sync="llA" :rad="radius" :options="{icon}" />
      <l-editablecirclemarker v-if="llB" :latLng.sync="llB" :rad="radius" :options="{icon}" />
      <l-marker v-if="geolocation" :latLng="geolocation" :icon="icon"/>
    </l-map>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet-polylinedecorator'
import 'leaflet-editablecirclemarker'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import LocationIcon from '@/components/LocationIcon'

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

@Component({
  components: {
    LMap,
    LTileLayer,
    LEditablecirclemarker,
    LPolyline,
    Polylinedecorator,
    LMarker,
  },
})
export default class Map extends Vue {
  public center = L.latLng(-34.9205, -57.953646)
  public options = {
    zoomControl: false,
  }

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

  public icon = LocationIcon

  get recorrido() {
    return this.$store.getters.getFirstRecorrido
  }
  get llA() {
    return this.$store.getters.llA
  }
  set llA(val) {
    this.$store.dispatch('setllA', val)
  }
  get llB() {
    return this.$store.getters.llB
  }
  set llB(val) {
    this.$store.dispatch('setllB', val)
  }
  get radius() {
    return this.$store.getters.radius
  }
  public onClick(e: LeafletMouseEvent) {
    this.$store.dispatch('clickMap', e.latlng)
  }
  get geolocation() {
    return this.$store.getters.geolocation
  }
}
</script>


<style lang="scss" scoped>
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
