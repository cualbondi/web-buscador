<template>
  <v-list :two-line="hasSubtext" class="results">
    <v-subheader v-if="title">{{ title }}</v-subheader>
    <template v-for="(result, index) in results">
      <v-divider v-if="shouldDivide(index)" inset :key="result.id + ' divider'"></v-divider>
      <v-list-tile :key="result.id" @click="resultClick(result)">
        <v-list-tile-avatar>
          <v-icon :color="result.icon.color">{{result.icon.name}}</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="result.text"></v-list-tile-title>
          <v-list-tile-sub-title v-html="result.subtext"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

export interface Result {
  id: number
  icon: {
    name: string
    color?: string,
  }
  text: string
  subtext?: string
}

@Component({})
export default class Home extends Vue {
  @Prop() public results!: Result[]

  @Prop() public title?: string

  get hasSubtext() {
    return (
      this.results &&
      this.results.length &&
      this.results[0].hasOwnProperty('subtext')
    )
  }

  @Emit('selection')
  public resultClick(result: Result) {
  }

  public shouldDivide(index: number) {
    return index % 2 === 1
  }
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
</style>
