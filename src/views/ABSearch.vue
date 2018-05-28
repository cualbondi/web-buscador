<template>
  <div class="main" :class="withResults">
    <side-menu></side-menu>
    <a-b-search-fields class="top"></a-b-search-fields>
    <Map class="middle" />
    <ResultList v-if="false" class="bottom"></ResultList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'
import ResultList from '@/components/ResultList.vue'

@Component({
  components: {
    ABSearchFields,
    Map,
    SideMenu,
    ResultList,
  },
})
export default class Home extends Vue {
  get withResults() {
    return false ? 'with-results' : 'no-results'
  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>
