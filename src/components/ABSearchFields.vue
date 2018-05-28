<template>
  <div class="search-container primary shadow-right">
    
    <v-btn class="menubtn" flat icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>  
    </v-btn>
    
    <div class="input-location origin" @click="searchOrigin">
      {{ locationOrigin }}
    </div>

    <div class="input-location destination" @click="searchDestination">
      {{ locationDestination }}
    </div>

    <v-btn class="swap" flat icon dark>
      <v-icon dark>swap_vert</v-icon>
    </v-btn>
  
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  public openMenu() {
    this.$store.dispatch('openSideMenu')
  }

  get locationOrigin() {
    const coords = this.$store.getters.llA
    if (!coords) {
      return 'Your location'
    }
    return `${coords.lat}, ${coords.lng}`
  }

  get locationDestination() {
    const coords = this.$store.getters.llB
    if (!coords) {
      return 'Select destination'
    }
    return `${coords.lat},${coords.lng}`
  }

  public searchOrigin() {
    this.$router.push({ name: 'location', params: { point: 'origin' } })
  }

  public searchDestination() {
    this.$router.push({ name: 'location', params: { point: 'destination' } })
  }
}
</script>

<style lang="scss" src="./ABSearchFields.scss" scoped>
</style>
