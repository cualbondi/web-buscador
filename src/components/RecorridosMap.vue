<template>
  <div class="mapContainer">
    <l-map :zoom="zoom" :center="center" @click="onClick" :options="options" ref="mapref">
      <l-control-attribution position="bottomright" prefix="© OpenStreetMap contributors" />

      <template v-if="recorrido">
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity" />
        <polylinedecorator :patterns="patterns" :paths="[recorrido.itinerario[0].ruta_corta]" />
        <l-marker v-if="recorrido.itinerario[0].p1" :latLng="recorrido.itinerario[0].p1.latlng" :icon="stopIcon">
          <l-popup>{{recorrido.itinerario[0].p1.nombre}}</l-popup>
        </l-marker>
        <l-marker v-if="recorrido.itinerario[0].p2" :latLng="recorrido.itinerario[0].p2.latlng" :icon="stopIcon">
          <l-popup>{{recorrido.itinerario[0].p2.nombre}}</l-popup>
        </l-marker>
      </template>

    </l-map>
  </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPolyline, LControlAttribution } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'mapbox-gl-leaflet'
import 'leaflet-polylinedecorator'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import { LatLngLocation } from '@/modules/absearch'
import {
  geoLocationIcon,
  StopIcon,
  DownIcon,
  UpIcon,
  AIcon,
  BIcon,
} from '@/components/icons'

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
    LPolyline,
    Polylinedecorator,
    LControlAttribution,
  },
})
export default class Map extends Vue {
  public options = {
    zoomControl: false,
    attributionControl: false,
  }

  public disabledPolyStyle = {
    color: '#444',
    opacity: 0.5,
    weight: 5,
  }

  public geoMarkerOptions = {
    draggable: false,
    radius: 0,
    icon: geoLocationIcon,
    opacity: 0,
    fillOpacity: 0.2,
    fillColor: '#4285f4',
  }

  public backPolyStyle = {
    color: '#555',
    opacity: 0.75,
    weight: 10,
  }

  public polyStyle = {
    color: '#51B2E0',
    opacity: 0.9,
    weight: 8,
  }

  public patterns = [decoratorArrow1, decoratorArrow2, decoratorArrow3]

  public stopIcon = StopIcon
  public downIcon = DownIcon
  public upIcon = UpIcon
  public aOptions = {
    draggable: true,
    icon: AIcon,
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.25,
    color: '#FFB703',
  }
  public bOptions = {
    draggable: true,
    icon: BIcon,
    weight: 1,
    opacity: 0.3,
    fillOpacity: 0.15,
    color: '#B72815',
  }

  get center() {
    return L.latLng(this.$store.getters.getCiudadLatlng)
  }
  get zoom() {
    return this.$store.getters.getCiudadZoom
  }
  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get recorridoSelectedIndex() {
    return this.$store.getters.getRecorridoSelectedIndex
  }
  set recorridoSelectedIndex(val) {
    ;(this as any).$ga.event('resultados', 'select', '', val)
    this.$store.dispatch('setRecorridoSelectedIndex', val)
  }
  get recorrido() {
    return this.$store.getters.getRecorridoSelected
  }
  get geolocation() {
    const coordinates: Coordinates = this.$store.getters.geolocation
    if (coordinates === null) {
      return null
    }
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      precision: coordinates.accuracy,
    }
  }
  public mounted() {
    (L as any).mapboxGL({
        style: 'https://tiles.cualbondi.com.ar/styles/osm-bright/style.json',
        accessToken: 'no-token'
    }).addTo((this.$refs.mapref as any).mapObject);
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
  background-color: white;
  height: 16px !important;
  width: 16px !important;
  border-radius: 50%;
  margin: -8px 0 0 -8px !important;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);

  &::after {
    display: block;
    position: relative;
    content: '';
    height: 12px;
    width: 12px;
    top: 2px;
    left: 2px;
    background-color: #4285f4;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out 0.5s infinite alternate;
  }
}

div.location-marker.red {
  background-color: red;
}

@keyframes pulse {
  from {
    transform: scale(1, 1);
  }
  to {
    transform: scale(0.8, 0.8);
  }
}
</style>

<style lang="scss">
.leaflet-map-pane:not(.leaflet-zoom-anim) div.leaflet-marker-icon.markerAB {
  transition: height 0.4s ease;
  transition: margin-top 0.4s ease;
}
</style>
