<template>
  <div class="search-container primary shadow-right">

    <TopBar />

    <v-btn class="swap" flat icon dark @click="swap">
      <v-icon dark>swap_vert</v-icon>
    </v-btn>
    <div class="input-location origin" @click="searchOrigin">
      <div class="cue"></div>
      {{ locationOrigin }}
    </div>
    <div class="input-location destination" @click="searchDestination">
      <div class="cue"></div>
      {{ locationDestination }}
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Location } from '@/modules/absearch'
import TopBar from '@/components/TopBar.vue'

@Component({
  components: {
    TopBar,
  },
})
export default class Home extends Vue {

  get locationOrigin() {
    const location: Location | null = this.$store.getters.A
    if (location === null) {
      return 'Selecciona un origen'
    }
    if (location.type === 'geolocation') {
      return 'Tu ubicacion'
    }
    if (location.type === 'geocoder') {
      return location.name
    }
    return `${location.lat}, ${location.lng}`
  }

  get locationDestination() {
    const location: Location | null = this.$store.getters.B
    if (location === null) {
      return 'Selecciona un destino'
    }
    if (location.type === 'geolocation') {
      return 'Tu ubicacion'
    }
    if (location.type === 'geocoder') {
      return location.name
    }
    return `${location.lat}, ${location.lng}`
  }

  public searchOrigin() {
    this.$router.push({ name: 'location', params: { point: 'origin' } })
  }

  public searchDestination() {
    this.$router.push({ name: 'location', params: { point: 'destination' } })
  }

  public swap() {
    ;(this as any).$ga.event('search', 'swapAB')
    this.$store.dispatch('swapAB')
  }

}
</script>

<style lang="scss" src="./ABSearchFields.scss" scoped>
</style>
