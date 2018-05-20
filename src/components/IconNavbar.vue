<template>
  <v-toolbar dark color="primary" flat>

    <v-toolbar-side-icon></v-toolbar-side-icon>
    
    <v-tooltip bottom>
      <v-btn icon :color="directionsColor" slot="activator" @click="toBusqueda">
        <v-icon>directions</v-icon>
      </v-btn>
      <span>Direcciones</span>
    </v-tooltip>
    
    <v-tooltip bottom>
      <v-btn icon slot="activator" :color="recorridosColor" @click="toRecorridos">
        <v-icon>directions_bus</v-icon>
      </v-btn>
      <span>Recorridos</span>
    </v-tooltip>
    <v-spacer></v-spacer>

    <v-tooltip bottom class="share-tooltip">
      <v-btn icon slot="activator">
        <v-icon>share</v-icon>
      </v-btn>
      <span>Compartir</span>
    </v-tooltip>
  
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
const selectedColor = 'blue darken-3'

@Component({})
export default class Home extends Vue {
  get directionsColor() {
    return this.$route.name === 'busqueda' ? selectedColor : 'primary'
  }

  get recorridosColor() {
    return this.$route.name === 'recorridos' ? selectedColor : 'primary'
  }

  toBusqueda() {
    this.$router.push({ name: 'busqueda' })
  }

  toRecorridos() {
    this.$router.push({ name: 'recorridos' })
  }
}
</script>

<style lang="sass" scoped>
.share-tooltip
  margin-right: 0 !important

</style>
