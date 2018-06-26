<template>
    <v-navigation-drawer
      class="navigation"
      v-model="sideMenuOpen"
      temporary
      absolute
      :touchless="true"
    >
      <v-toolbar color="primary">
        <v-spacer></v-spacer>
        <v-toolbar-title class="white--text">
          <img :src="logo" />
          </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="sideMenuOpen = false" class="white--text">
          <v-icon dark>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
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
        <v-divider></v-divider>
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
        <v-divider></v-divider>
        <v-list-tile @click="openExternalLink(`https://cualbondi.com.ar/agradecimientos/`)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>star</v-icon></div></div>
          Top usuarios
        </v-list-tile>
        <v-list-tile @click="openExternalLink(`https://goo.gl/forms/JRfMgq4ar0VgF9OA3`, true)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>comment</v-icon></div></div>
          Sugerencias
        </v-list-tile>
        <v-list-tile @click="openExternalLink(`https://github.com/cualbondi`, true)">
          <div class="v-input__prepend-outer"><div class="v-input__icon v-input__icon--prepend"><v-icon>usb</v-icon></div></div>
          Github
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
    window.open(href, inTab ? '_blank' : '_self')
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
.theme--light .v-text-field .v-input__slot:before,
.application .theme--light.v-text-field .v-input__slot:before,
.theme--light
  .v-text-field:not(.v-input--has-state):hover
  .v-input__slot:before,
.application
  .theme--light.v-text-field:not(.v-input--has-state):hover
  .v-input__slot:before,
.v-text-field .v-input__slot:after {
  background-color: transparent !important;
}
.navigation {
  .v-input {
    font-size: 14px;
  }
  .v-slider__thumb {
    width: 70px;
    height: 70px;
    left: -35px;
    top: initial;
    &.primary {
      background-color: transparent !important;
    }
  }
  .v-slider__thumb-container:after {
    content: '';
    width: 24px;
    height: 24px;
    left: -12px;
    top: 50%;
    border-radius: 50%;
    background: #4285f4;
    -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    -webkit-transform: translateY(-50%) scale(0.6);
    transform: translateY(-50%) scale(0.6);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: absolute;
    display: block;
  }
}
</style>
