<template>
  <div class="map-picker">
    
    <v-toolbar dark color="primary">
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
      <l-editablecirclemarker :latLng="center" :rad="300" :icon="icon" :options="{icon, draggable: false}" />
      <l-editablecirclemarker v-if="geolocation" :latLng="geolocation" :rad="geolocation.precision" :options="markerOptions"/>
    </l-map>
    
    <v-btn class="mylocation" fab color="white" @click="geolocate">
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
import LocationIcon from '@/components/LocationIcon'


@Component({
  components: {
    LMap,
    LTileLayer,
    LEditablecirclemarker,
    LMarker,
  },
})
export default class Map extends Vue {
  @Prop() initialCenter!: L.LatLng

  public icon = LocationIcon
  public options = { zoomControl: false }

  center = {...this.initialCenter}
  zoom = 13

  markerOptions = {
    draggable: false,
    radius: 0,
    icon: new L.DivIcon({ className: 'location-marker' }),
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: 'red'
  }

  updatingGeolocation = false
  move(e: LeafletMouseEvent) {
    if (!this.updatingGeolocation){
      this.center = e.target.getCenter()
    }
  }

  goBack() {
    this.$router.back()
  }

  onOk() {
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

  geolocate(){
    this.$store.dispatch('geolocate').then(position => {
      this.updatingGeolocation = true
      this.center = {
        lat: position.latitude,
        lng: position.longitude,
      }
      this.zoom = 16
    })
  }
  moveend(){
    this.updatingGeolocation = false
  }
}
</script>


<style lang="scss" scoped>
.map-picker {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
.mylocation {
  position: absolute !important;
  right: 0;
  bottom: 15px;
  z-index: 1000;
}
</style>
