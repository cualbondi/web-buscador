<template>
  <div class="absearch" :class="withResults">
    
    <CityHeader />

    <SideMenu />
    
    <ABSearchFields class="top" />
    
    <ABMap class="middle"/>
    
    <ABSearchResults class="bottom" :class="{small: smallResults}" v-if="searchRequested"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import ABMap from '@/components/ABMap.vue'
import SideMenu from '@/components/SideMenu.vue'
import ABSearchResults from '@/components/ABSearchResults/ABSearchResults.vue'
import CityHeader from '@/components/CityHeader.vue'

@Component({
  components: {
    ABSearchFields,
    ABMap,
    SideMenu,
    ABSearchResults,
    CityHeader,
  },
})
export default class Home extends Vue {
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
