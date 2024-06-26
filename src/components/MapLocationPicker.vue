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

    <l-map :zoom="zoom" :center="center" ref="mapref" :options="options" @move="move" @moveend="moveend">
      <l-control-attribution position="bottomright" prefix="© <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors" />

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
import { LMap, LTileLayer, LMarker, LControlAttribution } from 'vue2-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'
import 'mapbox-gl-leaflet'
import 'leaflet-editablecirclemarker'
import LEditablecirclemarker from 'vue2-leaflet-editablecirclemarker'
import { geoLocationIcon } from '@/components/icons'

@Component({
  components: {
    LMap,
    LTileLayer,
    LEditablecirclemarker,
    LMarker,
    LControlAttribution,
  },
})
export default class Map extends Vue {
  @Prop()
  public initialCenter!: {
    lat: number
    lng: number
  }

  @Prop()
  public icon!: any

  public options = {
    zoomControl: false,
    attributionControl: false
  }

  public center = { ...this.initialCenter }

  public markerOptions = {
    draggable: false,
    radius: 0,
    icon: geoLocationIcon,
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: 'red',
  }

  public updatingGeolocation = false

  public zoom = this.$store.getters.getCiudadZoom

  public mounted() {
    (L as any).mapboxGL({
        style: 'https://tiles.cualbondi.org/api/maps/cualbondi/style.json',
        accessToken: 'no-token'
    }).addTo((this.$refs.mapref as any).mapObject);
  }

  public move(e: LeafletMouseEvent) {
    if (!this.updatingGeolocation) {
      this.center = e.target.getCenter()
    }
  }

  public goBack() {
    ;(this as any).$ga.event('locationpicker', 'back')
    this.$router.back()
  }

  public onOk() {
    ;(this as any).$ga.event(
      'locationpicker',
      'ok',
      `${this.center.lat},${this.center.lng}`,
    )
    this.$emit('locationPicked', this.center)
  }

  get geolocation() {
    const coordinates: GeolocationCoordinates = this.$store.getters.geolocation
    if (coordinates === null) {
      return null
    }
    return {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      precision: coordinates.accuracy,
    }
  }

  public geolocate() {
    ;(this as any).$ga.event('locationpicker', 'geolocate')
    this.$store.dispatch('geolocate').then(position => {
      this.updatingGeolocation = true
      this.center = {
        lat: position.latitude,
        lng: position.longitude,
      }
      this.zoom = 16
    })
  }
  public moveend() {
    ;(this as any).$ga.event('locationpicker', 'moveend')
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
