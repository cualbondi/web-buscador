<template>
  <div class="search-container primary shadow-right">
    
    <v-btn class="menubtn" flat icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>  
    </v-btn>
    
    <div class="input-location origin" @click="searchOrigin">
      Your location
    </div>

    <div class="input-location destination" @click="searchDestination">
      Choose destination
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

  searchOrigin(){
    this.$router.push({ name: 'location', params: { point: 'origin' }})
  }

  searchDestination(){
    this.$router.push({ name: 'location', params: { point: 'destination' }})
  }
}
</script>

<style lang="scss" src="./ABSearchFields.scss" scoped>
</style>
