<template>
  <div class="search-container primary shadow-right">
    
    <v-btn class="menubtn" flat icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>  
    </v-btn>
    
    <div class="input-location origin" @click="searchOrigin">
      <div class="cue"></div>
      {{ locationOrigin }}
    </div>

    <div class="input-location destination" @click="searchDestination">
      <div class="cue"></div>
      {{ locationDestination }}
    </div>

    <v-btn class="swap" flat icon dark @click="swap">
      <v-icon dark>swap_vert</v-icon>
    </v-btn>
  
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Location } from '@/modules/absearch'

@Component({})
export default class Home extends Vue {
  public openMenu() {
    this.$store.dispatch('openSideMenu')
  }

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
