<template>
    <vue-headful
      :title="headfulTitle"
      :description="headfulDescription"
    />
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class Home extends Vue {
  get headfulTitle() {
    return `${this.ciudadNombre} - Buscador de Cualbondi`
  }
  get headfulDescription() {
    return `Buscador de recorridos de bondis, colectivos, micros en ${
      this.ciudadNombre
    }`
  }
  get ciudadNombre() {
    return this.$store.getters.getCiudadNombre
  }
}
</script>