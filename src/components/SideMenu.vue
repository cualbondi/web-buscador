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
      <v-list>
        <v-list-tile>
          <v-select
            class="citySelect"
            :items="ciudades"
            v-model="ciudad"
            item-text="nombre"
            item-value="slug"
            label="Ciudad"
            single-line
            auto
            prepend-icon="map"
            hide-details
          ></v-select>
        </v-list-tile>
        <v-list-tile @click="openExternalLink(`https://cualbondi.com.ar/${ciudad.slug}/`)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>location_city</v-icon></div></div>
          Ver mas informaci&oacute;n
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
      </v-list>
      <v-list>
        <v-list-tile>
          <v-slider
            @change="setRadius"
            v-model="radius"
            prepend-icon="directions_walk"
            :persistent-hint="true"
            :hint="'100'"
            :min="200"
            :max="800"
            :step="100"
            :ticks="true"
          />
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
      </v-list>
      <v-list>
        <v-list-tile @click="openExternalLink(`https://cualbondi.com.ar/agradecimientos/`)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>star</v-icon></div></div>
          Top usuarios
        </v-list-tile>
        <v-list-tile @click="openExternalLink(`https://spreadsheets.google.com/spreadsheet/viewform?formkey=dFJERlREQjUyaE1iSkFDYnhOa2Nnbmc6MQ+`, true)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>edit</v-icon></div></div>
          Sugerencias
        </v-list-tile>
      </v-list>
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
  public openExternalLink(href: string, inTab: boolean) {
    window.open(href, inTab ? '_blank' : '_self');
  }
  get ciudad() {
    return this.$store.getters.getCiudad
  }
  set ciudad(ciudadSlug) {
    console.log(ciudadSlug)
    this.$store.dispatch('setCiudad', ciudadSlug)
  }
  get ciudades() {
    return this.$store.getters.getCiudades
  }
}
</script>

<style lang="scss">
.theme--light .v-text-field .v-input__slot:before, .application .theme--light.v-text-field .v-input__slot:before,
.theme--light .v-text-field:not(.v-input--has-state):hover .v-input__slot:before, .application .theme--light.v-text-field:not(.v-input--has-state):hover .v-input__slot:before,
.v-text-field .v-input__slot:after
{
  background-color: transparent !important;
}
.navigation {
  .v-input {
    font-size: 14px;
  }
  .v-slider__thumb {
    width: 50px;
    height: 50px;
    left: -25px;
  }
}
</style>