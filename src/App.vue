<template>
  <v-app>
    <div id="root">
      <div id="side-menu">
        <router-view/>
      </div>
      <div id="map-slot">
        <Map />
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Map from '@/components/Map.vue'

@Component({
  components: {
    Map,
  },
})
export default class App extends Vue {}
</script>


<style lang="sass">
body,
html,
#root
  width: 100%
  height: 100%
  margin: 0
  font-family: Roboto

#root
  display: grid
  grid-template-columns: minmax(auto, 408px) 1fr

#side-menu

#map-slot

</style>
