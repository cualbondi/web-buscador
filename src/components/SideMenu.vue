<template>  
    <v-navigation-drawer
      class="navigation"
      v-model="sideMenuOpen"
      temporary
      absolute
    >
      <v-list class="pa-1">
        <v-list-tile>
          <img :src="logo" />
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
      </v-list>
      <v-list-tile>
        <v-slider
          @change="setRadius"
          v-model="radius"
          prepend-icon="directions_walk"
          :persistent-hint="true"
          :min="200"
          :max="800"
          :step="100"
          :ticks="true"
        />
      </v-list-tile>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import logo from '@/assets/logo.png'

@Component({})
export default class Home extends Vue {
  public logo = logo
  public radius = this.$store.getters.radius
  get sideMenuOpen() {
    return this.$store.getters.sideMenuOpen
  }
  set sideMenuOpen(value) {
    this.$store.dispatch('setSideMenu', value)
  }

  public setRadius(value: number) {
    this.$store.dispatch('setRadius', value)
  }
}
</script>
