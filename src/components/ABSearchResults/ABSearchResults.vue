<template>
<div>
  <RecorridosResultList 
    v-if="hayResultados"
    :results="recorridos" 
    :selectedIndex.sync="recorridoSelectedIndex"
  />
  
  <div v-if="!loadingResults && !hayResultados" class="no-results">
    No se encontraron resultados
  </div>

  <div class="progress">
  <v-progress-circular v-if="loadingResults" indeterminate color="primary"/>
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
  justify-content: center;
  font-size: 16px;
}
</style>
