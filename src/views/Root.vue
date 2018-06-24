<template>
  <v-container>
    <v-layout row wrap>
      <v-flex sm6 xs12>
        <div class="logo-container">
          <img src="../assets/isologo-min.png" />
        </div>
      </v-flex>
      <v-flex sm6 xs12>
        <div class="list-container">
          <v-list>
            <v-list-tile ripple v-for="ciudad in ciudades" :key="ciudad.slug" @click="gotoCiudad(ciudad)">
              <v-list-tile-content>
                <v-list-tile-title v-text="ciudad.nombre"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <v-icon>chevron_right</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </div>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Root extends Vue {
  get ciudades() {
    return this.$store.getters.getCiudades
  }
  public gotoCiudad(ciudad: any) {
    this.$store.dispatch('setCiudad', ciudad.slug)
    this.$router.push(`/${ciudad.slug}/`)
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #42bfe5;
  max-width: initial;
  .v-list {
    background-color: transparent;
  }
}
.list-container {
  height: 105vh;
  overflow: auto;
  .v-list__tile__content {
    color: #003B5C;
  }
}
.logo-container {
  width: 100%;
  text-align: right;
  img {
    max-height: 296px;
    height: 100%;
  }
}
@media (max-width: 600px) {
  .list-container {
    margin: auto;
    height: 75vh;
  }
  .logo-container {
    text-align: center;
    img {
      max-height: 20vh;
    }
  }
}
</style>
