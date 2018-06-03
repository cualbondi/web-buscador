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

    <l-map :zoom="13" :center="center" ref="mapRef" :options="options" @move="move">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-editablecirclemarker :latLng="center" :rad="300" :icon="icon" :options="{icon, draggable: false}" />
      <l-marker v-if="geolocation" :latLng="geolocation" :icon="icon"/>
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

  center = this.initialCenter


  move(e: LeafletMouseEvent) {
    this.center = e.target.getCenter()
  }

  goBack() {
    this.$router.back()
  }

  onOk() {
    this.$emit('locationPicked', this.center)
  }

  get geolocation() {
    return this.$store.getters.geolocation
  }

  geolocate(){
    this.$store.dispatch('geolocate')
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
