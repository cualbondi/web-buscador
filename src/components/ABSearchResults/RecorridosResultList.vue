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
            <span class="avatar">
              <v-icon>{{iconFromType(result.itinerario[0].type)}}</v-icon>
            </span>
            <span class="title" v-html="results[selectedIndex].itinerario[0].nombre"></span>
            <span class="description" v-if="result.itinerario[0].inicio || result.itinerario[0].fin">de {{results[selectedIndex].itinerario[0].inicio}} a {{results[selectedIndex].itinerario[0].fin}}</span>
            <span class="distances" v-if="result.itinerario.length === 1"><v-icon>directions_walk</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_bondi/100)/10}}km</span>
            <template v-if="transbordo">
              <span class="avatar avatar2"><v-icon>directions_bus</v-icon></span>
              <span class="title title2" v-html="results[selectedIndex].itinerario[1].nombre"></span>
              <span class="descripcion description2" v-if="result.itinerario[1].inicio || result.itinerario[1].fin">de {{results[selectedIndex].itinerario[1].inicio}} a {{results[selectedIndex].itinerario[1].fin}}</span>
              <span class="distances distances2"><v-icon>directions_walk</v-icon>{{Math.floor(results[selectedIndex].long_pata_transbordo+results[selectedIndex].itinerario[0].long_pata+results[selectedIndex].itinerario[1].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor((results[selectedIndex].itinerario[0].long_bondi+results[selectedIndex].itinerario[1].long_bondi)/100)/10}}km</span>
            </template>
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
            <v-icon>{{iconFromType(result.itinerario[0].type)}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="result.itinerario[0].nombre"></v-list-item-title>
            <v-list-item-subtitle v-if="result.itinerario[0].inicio || result.itinerario[0].fin">de {{result.itinerario[0].inicio}} a {{result.itinerario[0].fin}}</v-list-item-subtitle>
            <v-list-item-subtitle class="distances" v-if="result.itinerario.length === 1"><v-icon>directions_walk</v-icon>{{Math.floor(result.itinerario[0].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor(result.itinerario[0].long_bondi/100)/10}}km</v-list-item-subtitle>
            <v-list-item-subtitle v-if="result.itinerario.length === 2">Combinar con</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="second" v-if="result.itinerario.length === 2" :key="result.id + '_second'" @click="$emit('update:selectedIndex', $index); toggleSmallResults()" ripple :class="{selected: selectedIndex === $index}">
          <v-list-item-avatar>
            <v-icon>{{iconFromType(result.itinerario[1].type)}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="result.itinerario[1].nombre"></v-list-item-title>
            <v-list-item-subtitle v-if="result.itinerario[1].inicio || result.itinerario[1].fin">de {{result.itinerario[1].inicio}} a {{result.itinerario[1].fin}}</v-list-item-subtitle>
            <v-list-item-subtitle class="distances2"><v-icon>directions_walk</v-icon>{{Math.floor(result.long_pata_transbordo + result.itinerario[0].long_pata + result.itinerario[1].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor((result.itinerario[0].long_bondi+result.itinerario[1].long_bondi)/100)/10}}km</v-list-item-subtitle>
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
import { Recorrido } from '@/api/schema'

@Component({})
export default class RecorridosResultList extends Vue {
  @Prop()
  public results!: Recorrido[]
  @Prop()
  public selectedIndex: number
  @Prop()
  public small: boolean

  public directionRight = true

  public iconFromType = (type: string) =>
    ({
      'train': 'train',
      'subway': 'subway',
      'monorail': 'tram',
      'tram': 'tram',
      'light_rail': 'tram',
      'bus': 'directions_bus',
      'trolleybus': 'directions_bus',
      null: 'directions_bus'
    } as any)[type]

  public toggleSmallResults() {
    this.$store.dispatch('toggleSmallResults')
  }

  public getNextPage() {
    ;(this as any).$ga.event('resultados', 'more', '', this.results.length / 5)
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

  get transbordo() {
    return this.$store.getters.transbordo
  }

  public nextResult() {
    ;(this as any).$ga.event('resultados', 'next', '', this.selectedIndex)
    this.$emit('update:selectedIndex', this.selectedIndex + 1)
    this.directionRight = true
  }
  public prevResult() {
    ;(this as any).$ga.event('resultados', 'prev', '', this.selectedIndex)
    this.$emit('update:selectedIndex', this.selectedIndex - 1)
    this.directionRight = false
  }
}
</script>

<style lang="scss" src="./RecorridosResultList.scss" scoped>
</style>
