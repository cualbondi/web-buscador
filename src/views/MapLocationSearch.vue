<template>
  <MapLocationPicker :initialCenter="center" @locationPicked="locationPicked" :icon="icon"/>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MapLocationPicker from '@/components/MapLocationPicker.vue'
import L from 'leaflet'
import { LatLngLocation } from '@/modules/absearch'
import {
  geoLocationIcon,
  AIconDragging,
  BIconDragging,
} from '@/components/icons'

@Component({
  components: {
    MapLocationPicker,
  },
})
export default class extends Vue {
  public icon: any = null
  mounted() {
    if (this.$route.params.point === 'origin') {
      this.icon = AIconDragging
    } else {
      this.icon = BIconDragging
    }
  }
  get center() {
    const fallback = this.ciudadLatLng
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
  get ciudadLatLng() {
    return L.latLng(this.$store.getters.getCiudadLatlng)
  }
}
</script>


<style lang="scss" scoped>
</style>
