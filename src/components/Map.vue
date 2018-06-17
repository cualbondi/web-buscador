<template>
  <div class="mapContainer">
    <l-map :zoom="zoom" :center="center" @click="onClick" :options="options">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}" />

      <slot v-if="recorrido">
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity" />
        <polylinedecorator :patterns="patterns" :paths="[recorrido.itinerario[0].ruta_corta]" />
        <l-marker v-if="recorrido.itinerario[0].p1" :latLng="recorrido.itinerario[0].p1.latlng" :icon="stopIcon">
          <l-popup>{{recorrido.itinerario[0].p1.nombre}}</l-popup>
        </l-marker>
        <l-marker v-if="recorrido.itinerario[0].p2" :latLng="recorrido.itinerario[0].p2.latlng" :icon="stopIcon">
          <l-popup>{{recorrido.itinerario[0].p2.nombre}}</l-popup>
        </l-marker>
      </slot>

      <!--l-polyline v-for="(recorrido, $index) in recorridos" :key="recorrido.id" v-if="$index != recorridoSelectedIndex" @click="recorridoSelectedIndex = $index" :latLngs="recorrido.itinerario[0].ruta_corta" :color="disabledPolyStyle.color" :weight="disabledPolyStyle.weight" :opacity="disabledPolyStyle.opacity" /-->

      <l-editablecirclemarker v-if="llA" :latLng.sync="llA" :rad="radius" :options="{icon: aIcon}" />
      <l-editablecirclemarker v-if="llB" :latLng.sync="llB" :rad="radius" :options="{icon: bIcon}" />

      <l-editablecirclemarker v-if="geolocation" :latLng="geolocation" :rad="geolocation.precision" :options="markerOptions"/>

    </l-map>
  </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet-polylinedecorator'
import 'leaflet-editablecirclemarker'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import { LocationIcon, StopIcon, AIcon, BIcon } from '@/components/icons'

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
    LMarker,
    LTileLayer,
    LEditablecirclemarker,
    LPolyline,
    Polylinedecorator,
    LPopup,
  },
})
export default class Map extends Vue {

  @Prop({ default: () => L.latLng(-35.9205, -57.953646) })
  center: L.LatLng

  @Prop({ default: 11 })
  zoom: number

  public options = {
    zoomControl: false,
  }

  public disabledPolyStyle = {
    color: '#444',
    opacity: 0.5,
    weight: 5,
  }

  public markerOptions = {
    draggable: false,
    radius: 0,
    icon: new L.DivIcon({ className: 'location-marker' }),
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: 'red'
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

  public patterns = [decoratorArrow1, decoratorArrow2, decoratorArrow3]

  public locationIcon = LocationIcon
  public stopIcon = StopIcon
  public aIcon = AIcon
  public bIcon = BIcon

  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get recorridoSelectedIndex() {
    return this.$store.getters.getRecorridoSelectedIndex
  }
  set recorridoSelectedIndex(val) {
    this.$store.dispatch('setRecorridoSelectedIndex', val)
  }
  get recorrido() {
    return this.$store.getters.getRecorridoSelected
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
    const coordinates: Coordinates = this.$store.getters.geolocation
    if (coordinates === null) return null
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      precision: coordinates.accuracy,
    }
  }
}
</script>


<style lang="scss" scoped>
.mapContainer {
  height: 100%;
  path.leaflet-interactive {
    cursor: inherit;
  }
}
</style>
<style lang="scss">
.osmTileLayer {
  opacity: 0.9 !important;
  filter: saturate(90%);
}
div.location-marker {
  border: 1px solid #428bca;
  background-color: #5bc0de;
  height: 16px !important;
  width: 16px !important;
  border-radius: 8px;
  margin: -8px 0 0 -8px !important;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s infinite alternate;
}

div.location-marker.red {
  background-color: red;
}

@keyframes fadeIn {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
