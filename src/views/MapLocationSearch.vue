<template>
    <div class="map-picker">
        <v-toolbar dark color="primary">
        <v-toolbar-side-icon @click="goBack"><v-icon dark>arrow_back</v-icon></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">Elige un destino</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            ok
        </v-btn>
    </v-toolbar>
        <MapLocationPicker class="mpicker-map" />
        
        <v-btn class="mylocation" fab color="white">
            <v-icon dark>my_location</v-icon>
        </v-btn>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MapLocationPicker from '@/components/MapLocationPicker.vue'

@Component({
  components: {
    MapLocationPicker,
  },
})
export default class extends Vue {
  public goBack() {
    this.$router.back()
  }
}
</script>


<style lang="scss" scoped>
.map-picker {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
.mylocation {
  position: absolute;
  right: 0;
  bottom: 15px;
  z-index: 1000;
}
</style>
