<template>
<div class="results-container">
  <RecorridosResultList 
    v-if="hayResultados"
    :results="recorridos" 
    :selectedIndex.sync="recorridoSelectedIndex"
  />

  <div v-if="!loadingResults && !hayResultados" class="no-results">
    <div class="description">No se encontraron resultados</div>
    <v-btn color="primary" dark @click="buscarConTransbordo">Buscar con transbordo</v-btn>
  </div>

  <div v-if="loadingResults" class="progress">
    <v-progress-circular  indeterminate color="primary"/>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import RecorridosResultList from './RecorridosResultList.vue'

@Component({
  components: {
    RecorridosResultList,
  },
})
export default class ABSearchResults extends Vue {
  get hayResultados() {
    return this.recorridos.length > 0
  }
  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get recorridoSelectedIndex() {
    return this.$store.getters.getRecorridoSelectedIndex
  }
  set recorridoSelectedIndex(val) {
    this.$store.dispatch('setRecorridoSelectedIndex', val)
  }
  get loadingResults() {
    return this.$store.getters.getRecorridosLoading
  }
  buscarConTransbordo() {
    this.$store.dispatch('setTransbordo', true)
    this.$store.dispatch('query')
  }
}
</script>

<style lang="scss" scoped>
.results-container {
  height: 100%;
}
.progress {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90px;
}
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  padding: 10px 0;
}
</style>
