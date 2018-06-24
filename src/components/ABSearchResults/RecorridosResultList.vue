<template>
  <div>
    <div v-if="resultsLoading && results.length == 0">
      Buscando ...
    </div>
    <div class="single-result">
      
      <span class="arrow-left" :class="{disabled: !hasPrevResult}" :v-ripple="hasPrevResult" @click="prevResult">
        <v-icon>chevron_left</v-icon>
      </span>
      
      <span class="card" 
        @click="toggleSmallResults"
        v-touch="{
          left: nextResult,
          right: prevResult
        }">
        <transition name="fade">
          <span class="animated" :class="{directionRight: directionRight, directionLeft: !directionRight}" v-for="(result, $index) in results" :key="result.id" v-if="selectedIndex == $index">
            <span class="avatar"><v-icon>directions_bus</v-icon></span>
            <span class="title" v-html="results[selectedIndex].itinerario[0].nombre"></span>
            <span class="description">de {{results[selectedIndex].itinerario[0].inicio}} a {{results[selectedIndex].itinerario[0].fin}}</span>
            <span class="distances"><v-icon>directions_walk</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_bondi/100)/10}}km</span>
          </span>
        </transition>
      
      </span>
      
      <span class="arrow-right" :class="{disabled: !hasNextResult}" :v-ripple="hasNextResult" @click="nextResult">
        <v-icon>chevron_right</v-icon>
      </span>

    </div>
    <v-list :two-line="true" class="results">
      <v-list-tile v-for="(result, $index) in results" :key="result.id" @click="$emit('update:selectedIndex', $index); toggleSmallResults()" ripple :class="{selected: selectedIndex === $index}">
        <v-list-tile-avatar>
          <img v-if="result.itinerario.length === 1" :src="`/static/img/micros/30x35/${result.itinerario[0].foto}.png`" />
          <span v-if="result.itinerario.length === 2" title="Transbordo">T</span>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="result.itinerario[0].nombre"></v-list-tile-title>
          <v-list-tile-sub-title>de {{result.itinerario[0].inicio}} a {{result.itinerario[0].fin}}</v-list-tile-sub-title>
          <v-list-tile-sub-title><v-icon>directions_walk</v-icon>{{Math.floor(result.itinerario[0].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor(result.itinerario[0].long_bondi/100)/10}}km</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-btn v-if="resultsMore" @click="getNextPage">Buscar mas resultados</v-btn>
        <span v-if="resultsMoreLoading">Buscando mas ...</span>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Recorrido } from '@/api/schema'

@Component({})
export default class RecorridosResultList extends Vue {
  @Prop() public results!: Recorrido[]
  @Prop() public selectedIndex: number
  @Prop() public small: boolean

  directionRight = true

  toggleSmallResults() {
    this.$store.dispatch('toggleSmallResults')
  }

  getNextPage() {
    this.$store.dispatch('getNextPage')
  }

  get resultsLoading() {
    return this.$store.getters.getRecorridosLoading
  }

  get resultsMoreLoading() {
    return this.$store.getters.getResultsMoreLoading
  }

  get resultsMore() {
    return this.$store.getters.getResultsMore
  }

  get hasNextResult() {
    return this.$store.getters.hasNextResult
  }

  get hasPrevResult() {
    return this.$store.getters.hasPrevResult
  }
  nextResult() {
    this.$emit('update:selectedIndex', this.selectedIndex + 1)
    this.directionRight = true
  }
  prevResult() {
    this.$emit('update:selectedIndex', this.selectedIndex - 1)
    this.directionRight = false
  }
}
</script>

<style lang="scss" src="./RecorridosResultList.scss" scoped>
</style>
