<template>
  <v-list :two-line="true" class="results">
    <v-list-tile v-for="(result, $index) in results" :key="result.id" @click="$emit('update:selectedIndex', $index)" ripple :class="{selected: selectedIndex === $index}">
      <v-list-tile-avatar>
        <img v-if="result.itinerario.length === 1" :src="`/static/img/micros/30x35/${result.itinerario[0].foto}.png`" />
        <span v-if="result.itinerario.length === 2" title="Transbordo">T</span>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-html="result.itinerario[0].nombre"></v-list-tile-title>
        <v-list-tile-sub-title>de {{result.itinerario[0].inicio}} a {{result.itinerario[0].fin}}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Recorrido } from '@/api/schema'

@Component({})
export default class Home extends Vue {
  @Prop() public results!: Recorrido[]
  @Prop() public selectedIndex: number

}
</script>

<style lang="scss" scoped>
.results {
  margin-top: 5px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.subheader {
  height: 25px;
}
.selected {
  background: #DEF
}
</style>
