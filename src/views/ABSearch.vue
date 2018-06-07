<template>
  <div class="main" :class="withResults">
    <side-menu></side-menu>
    <a-b-search-fields class="top"></a-b-search-fields>
    <Map class="middle" />
    <RecorridosResultList v-if="recorridos.length > 0" :results="recorridos" :selectedIndex.sync="recorridoSelectedIndex" class="bottom" :small="isSmallScreen" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'
import RecorridosResultList from '@/components/RecorridosResultList.vue'

@Component({
  components: {
    ABSearchFields,
    Map,
    SideMenu,
    RecorridosResultList,
  },
})
export default class Home extends Vue {
  get isSmallScreen() {
    return this.$store.getters.isSmallScreen
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
