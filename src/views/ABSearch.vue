<template>
  <div class="main" :class="withResults">
    <side-menu></side-menu>
    <a-b-search-fields class="top"></a-b-search-fields>
    <Map class="middle" />
    <RecorridosResultList v-if="recorridos" :results="recorridos" :selectedIndex.sync="recorridoSelectedIndex" class="bottom"/>
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
    return false ? 'with-results' : 'no-results'
  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>
