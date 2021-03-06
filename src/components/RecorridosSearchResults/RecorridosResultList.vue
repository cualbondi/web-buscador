<template>
  <div class="result-list-container">
    <div class="single-result">
      <span class="arrow-left" :class="{disabled: !hasPrevResult}" :v-ripple="hasPrevResult" @click="prevResult">
        <v-icon>chevron_left</v-icon>
      </span>

      <span
        class="card"
        @click="toggleSmallResults"
        v-touch="{
          left: nextResult,
          right: prevResult
        }">
        <transition name="fade">
          <span class="animated" :class="{directionRight: directionRight, directionLeft: !directionRight}" v-for="(result, $index) in results" :key="result.id" v-if="selectedIndex == $index">
            <span class="avatar"><v-icon>directions_bus</v-icon></span>
            <span class="title" v-html="results[selectedIndex].nombre"></span>
            <span class="description" v-if="results[selectedIndex].inicio || results[selectedIndex].fin">de {{results[selectedIndex].inicio}} a {{results[selectedIndex].fin}}</span>
            <span class="distances"><v-icon>straighten</v-icon>{{Math.floor(results[selectedIndex].long_bondi/100)/10}}km</span>
          </span>
        </transition>

      </span>

      <span class="arrow-right" :class="{disabled: !hasNextResult}" :v-ripple="hasNextResult" @click="nextResult">
        <v-icon>chevron_right</v-icon>
      </span>

    </div>
    <v-list :two-line="true" class="results">
      <template v-for="(result, $index) in results">
        <v-list-item class="first" :key="result.id" @click="$emit('update:selectedIndex', $index); toggleSmallResults()" ripple :class="{selected: selectedIndex === $index}">
          <v-list-item-avatar>
            <img :src="`/static/img/micros/30x35/${result.foto}.png`" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="result.nombre"></v-list-item-title>
            <v-list-item-subtitle v-if="result.inicio || result.fin">de {{result.inicio}} a {{result.fin}}</v-list-item-subtitle>
            <v-list-item-subtitle><v-icon>straighten</v-icon>{{Math.floor(result.long_bondi/100)/10}}km</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item v-if="resultsMore" >
        <v-btn @click="getNextPage">Buscar mas resultados</v-btn>
      </v-list-item>
      <v-list-item v-if="resultsMoreLoading">
        <span>Buscando mas ...</span>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Itinerario } from '@/api/schema'

@Component({})
export default class RecorridosResultList extends Vue {
  @Prop()
  public results!: Itinerario[]
  @Prop()
  public selectedIndex: number
  @Prop()
  public small: boolean

  public directionRight = true

  public toggleSmallResults() {
    this.$store.dispatch('toggleSmallResultsSearchBus')
  }

  public getNextPage() {
    ;(this as any).$ga.event('resultados', 'more', '', this.results.length / 5)
    this.$store.dispatch('getNextPageSearchBus')
  }

  get resultsLoading() {
    return this.$store.getters.getRecorridosLoadingSearchBus
  }

  get resultsMoreLoading() {
    return this.$store.getters.getResultsMoreLoadingSearchBus
  }

  get resultsMore() {
    return this.$store.getters.getResultsMoreSearchBus
  }

  get hasNextResult() {
    return this.$store.getters.hasNextResultSearchBus
  }

  get hasPrevResult() {
    return this.$store.getters.hasPrevResultSearchBus
  }

  public nextResult() {
    ;(this as any).$ga.event('resultadosSearchBus', 'next', '', this.selectedIndex)
    this.$emit('update:selectedIndex', this.selectedIndex + 1)
    this.directionRight = true
  }
  public prevResult() {
    ;(this as any).$ga.event('resultadosSearchBus', 'prev', '', this.selectedIndex)
    this.$emit('update:selectedIndex', this.selectedIndex - 1)
    this.directionRight = false
  }
}
</script>

<style lang="scss" src="./RecorridosResultList.scss" scoped>
</style>
