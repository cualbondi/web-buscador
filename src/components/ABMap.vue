<template>
  <div class="mapContainer">
    <l-map :zoom="zoom" :center="center" @click="onClick" :options="options" ref="mapref">

      <template v-if="recorrido">
        <l-polyline :latLngs="recorrido.itinerario[0].ruta" :color="polyStyle.color" :weight="4" :opacity="polyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[0].ruta_corta" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity" />
        <polylinedecorator :patterns="patterns" :paths="[recorrido.itinerario[0].ruta_corta]" />
        <l-marker v-if="recorrido.itinerario[0].p1" :latLng="recorrido.itinerario[0].p1.latlng" :icon="stopIconA">
          <l-popup>{{recorrido.itinerario[0].p1.nombre}}</l-popup>
        </l-marker>
        <l-marker v-if="recorrido.itinerario[0].p2" :latLng="recorrido.itinerario[0].p2.latlng" :icon="stopIconB">
          <l-popup>{{recorrido.itinerario[0].p2.nombre}}</l-popup>
        </l-marker>
        <l-marker :key="p.latlng[0]" v-for="p in recorrido.itinerario[0].paradas" v-if="!(recorrido.itinerario[0].p1 && p.latlng[0] == recorrido.itinerario[0].p1.latlng[0]) && !(recorrido.itinerario[0].p2 && p.latlng[0] == recorrido.itinerario[0].p2.latlng[0])" :latLng="p.latlng" :icon="miniStopIcon">
          <l-popup>{{p.nombre}}</l-popup>
        </l-marker>
      </template>

      <template v-if="recorrido && recorrido.itinerario.length == 2">
        <l-polyline :latLngs="recorrido.itinerario[1].ruta" :color="polyStyle.color" :weight="4" :opacity="polyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[1].ruta_corta" :color="backPolyStyle.color" :weight="backPolyStyle.weight" :opacity="backPolyStyle.opacity" />
        <l-polyline :latLngs="recorrido.itinerario[1].ruta_corta" :color="polyStyle.color" :weight="polyStyle.weight" :opacity="polyStyle.opacity" />
        <polylinedecorator :patterns="patterns" :paths="[recorrido.itinerario[1].ruta_corta]" />
        <l-marker v-if="recorrido.itinerario[1].p1" :latLng="recorrido.itinerario[1].p1.latlng" :icon="stopIconA">
          <l-popup>{{recorrido.itinerario[1].p1.nombre}}</l-popup>
        </l-marker>
        <l-marker v-if="recorrido.itinerario[1].p2" :latLng="recorrido.itinerario[1].p2.latlng" :icon="stopIconB">
          <l-popup>{{recorrido.itinerario[1].p2.nombre}}</l-popup>
        </l-marker>

        <!-- agregar icono de bajada y de subida (transbordos) -->
        <l-polyline :latLngs="[recorrido.itinerario[0].ruta_corta[recorrido.itinerario[0].ruta_corta.length-1], recorrido.itinerario[1].ruta_corta[0]]" :color="'#555'" :weight="2" :opacity="0.9" />
        <l-marker :latLng="recorrido.itinerario[0].ruta_corta[recorrido.itinerario[0].ruta_corta.length-1]" :icon="stopIconT">
          <l-popup>Bajar de {{recorrido.itinerario[0].nombre}}</l-popup>
        </l-marker>
        <l-marker :latLng="recorrido.itinerario[1].ruta_corta[0]" :icon="stopIconT">
          <l-popup>Subir a {{recorrido.itinerario[1].nombre}}</l-popup>
        </l-marker>

        <l-marker :key="p.latlng[0]" v-for="p in recorrido.itinerario[1].paradas" v-if="p.latlng[0] != recorrido.itinerario[1].p1.latlng[0] && p.latlng[0] != recorrido.itinerario[1].p2.latlng[0]" :latLng="p.latlng" :icon="miniStopIcon">
          <l-popup>{{p.nombre}}</l-popup>
        </l-marker>
      </template>

      <l-editablecirclemarker v-if="geolocation" :latLng="geolocation" :rad="geolocation.precision" :options="geoMarkerOptions"/>

      <l-editablecirclemarker v-if="A" :latLng.sync="A" :rad="radius" :options="aOptions" />
      <l-editablecirclemarker v-if="B" :latLng.sync="B" :rad="radius" :options="bOptions" />

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
import 'mapbox-gl-leaflet'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import { LatLngLocation } from '@/modules/absearch'
import {
  geoLocationIcon,
  miniStopIcon,
  StopIconA,
  StopIconB,
  StopIconT,
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
    LEditablecirclemarker,
    LPolyline,
    Polylinedecorator,
    LPopup,
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

  public miniStopIcon = miniStopIcon
  public stopIcon = StopIcon
  public stopIconA = StopIconA
  public stopIconB = StopIconB
  public stopIconT = StopIconT
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
  get A() {
    return this.$store.getters.A
  }
  // This is a hack that prevents double updating location
  // due to events in the map triggering twice
  set A(val) {
    const A = this.A
    if (A.lat !== val.lat || A.lng !== val.lng) {
      this.$store.dispatch('setA', {
        lat: val.lat,
        lng: val.lng,
        type: 'latlng',
      })
    }
  }
  get B() {
    return this.$store.getters.B
  }
  set B(val) {
    const B = this.B
    if (B.lat !== val.lat || B.lng !== val.lng) {
      this.$store.dispatch('setB', {
        lat: val.lat,
        lng: val.lng,
        type: 'latlng',
      })
    }
  }
  get radius() {
    return this.$store.getters.radius
  }
  public onClick(e: LeafletMouseEvent) {
    this.$store.dispatch('clickMap', e.latlng)
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
    const A = this.A
    const B = this.B
    const mapref: any = this.$refs.mapref

    const gl = (L as any).mapboxGL({
        style: 'https://tiles.cualbondi.com.ar/styles/osm-bright/style.json',
        accessToken: 'no-token'
    }).addTo(mapref.mapObject);

    let bounds = L.latLngBounds([])
    if (A && A.lat !== null && A.lng !== null) {
      bounds.extend({ lat: A.lat, lng: A.lng })
    }
    if (B && B.lat !== null && B.lng !== null) {
      bounds.extend({ lat: B.lat, lng: B.lng })
    }

    if (bounds.isValid()) {
      bounds = bounds.pad(0.1)
      mapref.mapObject.flyToBounds(bounds, { maxZoom: 14, animate: false })
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
.leaflet-gl-layer {
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

div.ministop-marker {
  background-color: rgba(255, 255, 255, 0.9);
  height: 10px !important;
  width: 10px !important;
  border-radius: 50%;
  margin: -5px 0 0 -5px !important;
  border: 1px solid rgba(85, 85, 85, 0.75);
}

div.stop-marker-a {
  background-color: #FFB703;
  height: 16px !important;
  width: 16px !important;
  border-radius: 50%;
  margin: -8px 0 0 -8px !important;
  border: 2px solid rgb(85, 85, 85);
}
div.stop-marker-b {
  background-color: #D62815;
  height: 16px !important;
  width: 16px !important;
  border-radius: 50%;
  margin: -8px 0 0 -8px !important;
  border: 2px solid rgba(85, 85, 85, 1);
}
div.stop-marker-t {
  background-color: #FFF;
  height: 16px !important;
  width: 16px !important;
  border-radius: 50%;
  margin: -8px 0 0 -8px !important;
  border: 2px solid rgba(85, 85, 85, 1);
}
</style>

<style lang="scss">
.leaflet-map-pane:not(.leaflet-zoom-anim) div.leaflet-marker-icon.markerAB {
  transition: height 0.4s ease;
  transition: margin-top 0.4s ease;
}
.leaflet-map-pane div.leaflet-marker-icon.markerAB {
  margin-left: -15px !important;
  margin-top: -43px !important;
  width: 30px !important;
  height: 43px !important;
  opacity: 1 !important;
  background-size: contain;
}
div.leaflet-marker-icon.markerA {
  background: url('../assets/markerA.png');
}
div.leaflet-marker-icon.markerA.leaflet-drag-target,
.leaflet-dragging div.leaflet-marker-icon.markerA.drag {
  background: url('../assets/markerA-drag.png');
}
div.leaflet-marker-icon.markerB {
  background: url('../assets/markerB.png');
}
div.leaflet-marker-icon.markerB.leaflet-drag-target,
.leaflet-dragging div.leaflet-marker-icon.markerB.drag {
  background: url('../assets/markerB-drag.png');
}
div.leaflet-marker-icon.leaflet-drag-target.markerAB,
.leaflet-dragging div.leaflet-marker-icon.markerAB.drag {
  margin-left: -4px !important;
  margin-top: -46px !important;
  width: 36px !important;
  height: 49px !important;
}
</style>
