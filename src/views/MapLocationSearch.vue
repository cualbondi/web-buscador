<template>
  <MapLocationPicker :initialCenter="center" @locationPicked="locationPicked" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MapLocationPicker from '@/components/MapLocationPicker.vue'
import L from 'leaflet'
import { LatLngLocation } from '@/modules/absearch'

@Component({
  components: {
    MapLocationPicker,
  },
})
export default class extends Vue {
  get center() {
    const fallback = L.latLng(-34.9205, -57.953646)
    const location: LatLngLocation =
      this.$route.params.point === 'origin'
        ? this.$store.getters.A
        : this.$store.getters.B
    if (location === null || location.lat === null) {
      return fallback
    }
    return location
  }
  setLatlng(val: LatLng) {
    const newLocation = {
      lat: val.lat,
      lng: val.lng,
      type: 'latlng',
    }
    this.$route.params.point === 'origin'
      ? this.$store.dispatch('setA', newLocation)
      : this.$store.dispatch('setB', newLocation)
  }
  locationPicked(center: LatLng) {
    this.setLatlng(center)
    this.$router.push({ name: 'absearch' })
  }
}
</script>


<style lang="scss" scoped>
</style>
