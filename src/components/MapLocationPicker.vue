<template>
  <div class="map-picker">

    <v-toolbar class="toolbar" dark color="primary">
      <v-toolbar-side-icon @click="goBack">
        <v-icon dark>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Elige un destino</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onOk">
          ok
      </v-btn>
    </v-toolbar>

    <l-map :zoom="zoom" :center="center" ref="mapRef" :options="options" @move="move" @moveend="moveend">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-editablecirclemarker :latLng="center" :rad="300" :icon="icon" :options="{icon: icon, draggable: false}" />
      <l-editablecirclemarker v-if="geolocation" :latLng="geolocation" :rad="geolocation.precision" :options="markerOptions"/>
    </l-map>

    <v-btn class="mylocation" fab color="white" :style="{color: locatemeColor}" @click="geolocate">
        <v-icon>my_location</v-icon>
    </v-btn>
  </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'leaflet-editablecirclemarker'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'
import { geoLocationIcon } from '@/components/icons'

@Component({
  components: {
    LMap,
    LTileLayer,
    LEditablecirclemarker,
    LMarker,
  },
})
export default class Map extends Vue {
  @Prop()
  initialCenter!: {
    lat: number
    lng: number
  }

  @Prop() icon!: any

  public options = { zoomControl: false }

  center = { ...this.initialCenter }

  markerOptions = {
    draggable: false,
    radius: 0,
    icon: geoLocationIcon,
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: 'red',
  }

  updatingGeolocation = false

  get zoom() {
    return this.$store.getters.getCiudadZoom
  }
  
  move(e: LeafletMouseEvent) {
    if (!this.updatingGeolocation) {
      this.center = e.target.getCenter()
    }
  }

  goBack() {
    (this as any).$ga.event('locationpicker', 'back')
    this.$router.back()
  }

  onOk() {
    (this as any).$ga.event('locationpicker', 'ok', `${this.center.lat},${this.center.lng}`)
    this.$emit('locationPicked', this.center)
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

  geolocate() {
    (this as any).$ga.event('locationpicker', 'geolocate')
    this.$store.dispatch('geolocate').then(position => {
      this.updatingGeolocation = true
      this.center = {
        lat: position.latitude,
        lng: position.longitude,
      }
      this.zoom = 16
    })
  }
  moveend() {
    (this as any).$ga.event('locationpicker', 'moveend')
    this.updatingGeolocation = false
  }

  get locatemeColor() {
    const geolocation = this.geolocation
    if (
      geolocation !== null &&
      this.center.lat === geolocation.lat &&
      this.center.lng === geolocation.lng
    ) {
      return '#4285f4'
    }
    return '#4a4a4a'
  }
}
</script>


<style lang="scss" scoped>
.map-picker {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
.toolbar {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
  z-index: 1000;
}
.mylocation {
  position: absolute !important;
  right: 0;
  bottom: 15px;
  z-index: 1000;
  i {
    border-radius: 50%;
    background-color: white;
  }
}
</style>
