<template>
  <div class="mapContainer">
    <l-map style="height: 90%" :zoom="11" :center="center">
      <l-tile-layer :url="'http://{s}.tile.osm.org/{z}/{x}/{y}.png'"></l-tile-layer>
      <l-polyline :latLngs="recorrido"></l-polyline>
    </l-map>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LPolyline } from 'vue2-leaflet'
import L from 'leaflet'

@Component({
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPolyline
    }
})
export default class Map extends Vue {
    center = L.latLng(-34.9205, -57.953646)

    get recorrido(){
        return this.$store.getters.getFirstRecorrido
    }
}
</script>

<style lang="scss" scoped>
  @import "~leaflet/dist/leaflet.css";
  .mapContainer {
    height: 100%;
  }
</style>
