<template>
  <div class="main" :class="withResults">
    <vue-headful
      :title="headfulTitle"
      :description="headfulDescription"
    />
    
    <side-menu></side-menu>
    
    <a-b-search-fields class="top"></a-b-search-fields>
    
    <Map class="middle" :center="center" :zoom="zoom" />
    
    <a-b-search-results class="bottom" :class="{small: smallResults}" v-if="searchRequested"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'
import ABSearchResults from '@/components/ABSearchResults/ABSearchResults.vue'
import L from 'leaflet'

@Component({
  components: {
    ABSearchFields,
    Map,
    SideMenu,
    ABSearchResults,
  },
})
export default class Home extends Vue {
  get headfulTitle() {
    return `${this.ciudadNombre} - Buscador de Cualbondi`
  }
  get headfulDescription() {
    return `Buscador de recorridos de bondis, colectivos, micros en ${
      this.ciudadNombre
    }`
  }
  get ciudadNombre() {
    return this.$store.getters.getCiudadNombre
  }
  get center() {
    return L.latLng(this.$store.getters.getCiudadLatlng)
  }
  get zoom() {
    return this.$store.getters.getCiudadZoom
  }
  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get withResults() {
    return this.searchRequested ? 'with-results' : 'no-results'
  }
  get searchRequested() {
    return this.$store.getters.searchRequested
  }
  get smallResults() {
    return this.$store.getters.getSmallResults
  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>

<style lang="scss" scoped>
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
