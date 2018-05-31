<template>
  <div class="map-picker">
    
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon @click="goBack">
        <v-icon dark>arrow_back</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Elige un destino</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
          ok
      </v-btn>
    </v-toolbar>

    <l-map :zoom="11" :center="center" ref="mapRef" :options="options" @move="move">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}"></l-tile-layer>
      <l-editablecirclemarker :latLng="center" :rad="300" :options="{icon}" />
    </l-map>
    
    <v-btn class="mylocation" fab color="white">
        <v-icon>my_location</v-icon>
    </v-btn>
  </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
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
  },
})
export default class Map extends Vue {
  public center = L.latLng(-34.9205, -57.953646)
  public icon = LocationIcon
  public options = { zoomControl: false }

  move(e: LeafletMouseEvent) {
    this.center = e.target.getCenter()
  }
  get latlng() {
    return this.$route.params.point === 'origin'
      ? this.$store.getters.llA
      : this.$store.getters.llB
  }
  set latlng(val) {
    this.$route.params.point === 'origin'
      ? this.$store.dispatch('setllA', val)
      : this.$store.dispatch('setllB', val)
  }
  public goBack() {
    this.$router.back()
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
