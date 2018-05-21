<template>
  <div>
    <!-- <icon-navbar></icon-navbar> -->
    <v-navigation-drawer
      v-model="sideMenuOpen"
      temporary
      absolute
    >
      <side-menu></side-menu>
    </v-navigation-drawer>
    <v-btn @click="openMenu">
      <v-icon dark>location_on</v-icon>  
    </v-btn>
    <v-btn @click="query">
      <v-icon dark>location_on</v-icon>  
    </v-btn>
    <a-b-search-fields></a-b-search-fields>
    <Map />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IconNavbar from '@/components/IconNavbar.vue'
import ABSearchFields from '@/components/ABSearchFields.vue'
import Map from '@/components/Map.vue'
import SideMenu from '@/components/SideMenu.vue'

@Component({
  components: {
    IconNavbar,
    ABSearchFields,
    Map,
    SideMenu
  }
})
export default class Home extends Vue {
  get sideMenuOpen(){
    return this.$store.getters.sideMenuOpen
  }

  set sideMenuOpen(value){
    this.$store.dispatch('setSideMenu', value)
  }

  openMenu(){
    this.$store.dispatch('openSideMenu')
  }

  query(){
    this.$store.dispatch('query')
  }
}
</script>

<style lang="sass" scoped>

</style>
