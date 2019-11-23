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
            <v-list-item ripple v-for="ciudad in ciudades" :key="ciudad.slug" @click="gotoCiudad(ciudad)">
              <v-list-item-content>
                <v-list-item-title v-text="ciudad.nombre"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-avatar>
                <v-icon>chevron_right</v-icon>
              </v-list-item-avatar>
            </v-list-item>
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
    ;(this as any).$ga.event('root', 'select_ciudad', ciudad.slug)
    this.$store.dispatch('setCiudad', ciudad.slug)
    this.$router.push(`/${ciudad.slug}/`)
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #51b2e0;
  max-width: initial;
  .v-list {
    background-color: transparent;
  }
}
.list-container {
  height: 105vh;
  overflow: auto;
  .v-list-item__content {
    color: #003b5c;
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
