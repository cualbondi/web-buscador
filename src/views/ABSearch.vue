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
  get withResults(){
    return false ? 'with-results' : 'no-results' 
  }
}
</script>

<style lang="scss" scoped>
.navigation {
  z-index: 10000;
}
.main {
  height: 100%;
  display: grid;
}
.top,
.bottom {
  z-index: 1000;
}
.top {
  grid-area: top;
}
.middle {
  grid-area: map;
}
.bottom {
  grid-area: bottom;
}

@media (max-width: 600px) {
  .no-results {
    grid-template-areas: 'top' 'map' 'map';
  }
  .with-results {
    grid-template-areas: 'top' 'map' 'bottom';
  }
  .main {
    grid-template-rows: 120px auto 50px;
  }
}
@media (min-width: 601px) {
  .main {
    grid-template-areas: 'top map' 'bottom map';
    grid-template-rows: 130px auto;
    grid-template-columns: 400px auto;
  }
}
</style>
