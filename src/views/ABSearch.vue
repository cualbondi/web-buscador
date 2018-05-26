<template>
  <div class="main">
    <v-navigation-drawer
      class="navigation"
      v-model="sideMenuOpen"
      temporary
      absolute
    >
      <side-menu></side-menu>
    </v-navigation-drawer>
    <a-b-search-fields class="top"></a-b-search-fields>
    <Map class="middle" />
    <ResultList class="bottom"></ResultList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IconNavbar from '@/components/IconNavbar.vue'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'
import ResultList from '@/components/ResultList.vue'

@Component({
  components: {
    IconNavbar,
    ABSearchFields,
    Map,
    SideMenu,
    ResultList,
  },
})
export default class Home extends Vue {
  get sideMenuOpen() {
    return this.$store.getters.sideMenuOpen
  }
  set sideMenuOpen(value) {
    this.$store.dispatch('setSideMenu', value)
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

  @media (max-width: 600px) {
    .main {
      grid-template-rows: 130px auto 50px;
    }
    .top {
      grid-row: 1;
    }
    .middle {
      grid-row: 2;
    }
    .bottom {
      grid-row: 3;
    }
  }

  @media (min-width: 601px) {
    .main {
      grid-template-rows: 130px auto;
      grid-template-columns: 300px auto;
    }
    .top {
      grid-row: 1;
      grid-column: 1;
    }
    .middle {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
    .bottom {
      grid-row: 2;
      grid-column: 1;
    }
  }
</style>
