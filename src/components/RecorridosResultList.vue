<template>
  <div>
    <div v-if="resultsLoading && results.length == 0">
      Buscando ...
    </div>
    <div class="single-result">
      <span class="arrow-left" v-ripple @click="$emit('update:selectedIndex', selectedIndex - 1); directionRight = false">
        <v-icon>chevron_left</v-icon>
      </span>
      <span class="card" @click="toggleSmallResults">
        <transition name="fade">
          <span class="animated" :class="{directionRight: directionRight, directionLeft: !directionRight}" v-for="(result, $index) in results" :key="result.id" v-if="selectedIndex == $index">
            <span class="avatar"><v-icon>directions_bus</v-icon></span>
            <span class="title" v-html="results[selectedIndex].itinerario[0].nombre"></span>
            <span class="description">de {{results[selectedIndex].itinerario[0].inicio}} a {{results[selectedIndex].itinerario[0].fin}}</span>
            <span class="distances"><v-icon>directions_walk</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_pata)}}mts <v-icon>directions_bus</v-icon>{{Math.floor(results[selectedIndex].itinerario[0].long_bondi/100)/10}}km</span>
          </span>
        </transition>
      </span>
      <span class="arrow-right" v-ripple @click="$emit('update:selectedIndex', selectedIndex + 1); directionRight = true">
        <v-icon>chevron_right</v-icon>
      </span>
    </div>
    <v-list :two-line="true" class="results">
      <v-list-tile v-for="(result, $index) in results" :key="result.id" @click="$emit('update:selectedIndex', $index)" ripple :class="{selected: selectedIndex === $index}">
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
export default class Home extends Vue {
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

}
</script>

<style lang="scss" scoped>
.single-result {
  height: 90px;
  display: grid;
  grid-template-columns: 10% 1fr 10%;
  grid-template-rows: 100%;
  grid-template-areas:
    "left card right";
  > span.arrow-left {
    grid-area: left;
    background: white;
    border-right: 1px solid #ddd;
    z-index: 10;
    display: grid;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
  > span.card {
    background: white;
    position: relative;
    overflow: hidden;
    span.animated {
      background: white;
      position: absolute;
      grid-area: card;
      display: grid;
      height: 100%;
      width: 100%;
      padding-top: 2%;
      grid-template-columns: 35px 1fr;
      grid-template-rows: 43% 25% 25%;
      grid-template-areas:
        "avatar title"
        "description description"
        "distances distances";
      > span.avatar {
        grid-area: avatar;
        align-self: center;
        justify-self: center;
      }
      > span.title {
        grid-area: title;
        align-self: center;
      }
      > span.description {
        grid-area: description;
        align-self: center;
        margin-left: 10px;
      }
      > span.distances {
        grid-area: distances;
        align-self: center;
        margin-left: 8px;
        .v-icon {
          font-size: 17px;
          vertical-align: text-top;
        }
      }
    }
  }
  > span.arrow-right {
    grid-area: right;
    background: white;
    border-left: 1px solid #ddd;
    z-index: 10;
    display: grid;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }
}

@media (min-width: 601px) {
  .single-result {
    display: none;
  }
}


$speed: 0.2s;

.directionRight {
  &.fade-enter-active, &.fade-leave-active {
    right: -100%;
    animation: slideRight $speed forwards;
  }
  &.fade-leave-to {
    right: 0px;
    animation: slideRight $speed forwards;
  }
  &.fade-enter-active {
    right: -100%;
    animation: slideRightBack $speed forwards;
  }
  &.fade-enter {
    right: 0px;
    animation: slideRightBack $speed forwards;
  }
}
@keyframes slideRight {
    100% { right: -100%; }
}
@keyframes slideRightBack {
    100% { right: 0; }
}

.directionLeft {
  &.fade-leave-active {
    left: -100%;
    animation: slideLeft $speed forwards;
  }
  &.fade-leave-to {
    left: 0px;
    animation: slideLeft $speed forwards;
  }
  &.fade-enter-active {
    left: -100%;
    animation: slideLeftBack $speed forwards;
  }
  &.fade-enter {
    left: 0px;
    animation: slideLeftBack $speed forwards;
  }
}
@keyframes slideLeft {
    100% { left: -100%; }
}
@keyframes slideLeftBack {
    100% { left: 0; }
}

.results {
  margin-top: 5px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  height: 100%;
  overflow: auto;
  margin: 0;
}
.subheader {
  height: 25px;
}
.selected {
  background: #DEF
}
</style>
