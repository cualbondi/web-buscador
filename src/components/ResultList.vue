<template>
  <v-list :two-line="hasSubtext" class="results">
    <v-subheader v-if="title">{{ title }}</v-subheader>
    <template v-for="(result, index) in results">
      <v-divider
        v-if="index !== 0"
        inset
        :key="result.id + ' divider'"
      ></v-divider>
      <v-list-item :key="result.id" @click="$emit('selection', result)">
        <v-list-item-avatar>
          <v-icon :color="result.icon.color">{{ result.icon.name }}</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="result.text"></v-list-item-title>
          <v-list-item-subtitle v-html="result.subtext"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

export interface Result {
  id: number
  icon: {
    name: string
    color?: string
  }
  text: string
  subtext?: string
}

@Component({})
export default class Home extends Vue {
  @Prop()
  public results: Result[]

  @Prop()
  public title?: string

  get hasSubtext() {
    return (
      this.results &&
      !!this.results.length &&
      this.results[0].hasOwnProperty('subtext')
    )
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
