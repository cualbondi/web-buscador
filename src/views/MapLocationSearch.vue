<template>
  <MapLocationPicker :initialCenter="latlng" @locationPicked="locationPicked" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MapLocationPicker from '@/components/MapLocationPicker.vue'
import L from 'leaflet'

@Component({
  components: {
    MapLocationPicker,
  },
})
export default class extends Vue {
  get latlng() {
    const latlng =
      this.$route.params.point === 'origin'
        ? this.$store.getters.A
        : this.$store.getters.B
    return latlng || L.latLng(-34.9205, -57.953646)
  }
  setLatlng(val: L.LatLng) {
    this.$route.params.point === 'origin'
      ? this.$store.dispatch('setA', val)
      : this.$store.dispatch('setB', val)
  }
  locationPicked(center: L.LatLng) {
    this.setLatlng(center)
    this.$router.push({ name: 'absearch' })
  }
}
</script>


<style lang="scss" scoped>
</style>
