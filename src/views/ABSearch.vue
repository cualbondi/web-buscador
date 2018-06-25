<template>
  <div class="main" :class="withResults">
    <vue-headful
      :title="headfulTitle"
      :description="headfulDescription"
    />
    
    <side-menu></side-menu>
    
    <a-b-search-fields class="top"></a-b-search-fields>
    
    <Map class="middle" :center="center" :zoom="zoom" />
    
    <RecorridosResultList v-if="recorridos.length > 0" :results="recorridos" 
    :selectedIndex.sync="recorridoSelectedIndex" class="bottom" :class="{small: smallResults}" />

    <div class="footerad">
      <Adsense
        data-ad-client="ca-pub-1193419141108967"
        data-ad-slot="9086127115"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'
import RecorridosResultList from '@/components/RecorridosResultList.vue'
import L from 'leaflet'

@Component({
  components: {
    ABSearchFields,
    Map,
    SideMenu,
    RecorridosResultList,
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
  get smallResults() {
    return this.$store.getters.getSmallResults
  }
  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get recorridoSelectedIndex() {
    return this.$store.getters.getRecorridoSelectedIndex
  }
  set recorridoSelectedIndex(val) {
    this.$store.dispatch('setRecorridoSelectedIndex', val)
  }
  get withResults() {
    return this.recorridos.length > 0 ? 'with-results' : 'no-results'
  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>

<style lang="scss">
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
