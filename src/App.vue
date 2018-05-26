<template>
  <v-app>
    <div id="root">
      <router-view/>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
})
export default class App extends Vue {}
</script>

<style lang="scss">
body,
html,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: Roboto;
}
</style>
