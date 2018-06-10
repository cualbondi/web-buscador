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
@import '~leaflet/dist/leaflet.css';

body,
html,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: Roboto;
  background: #F5F5F5;
  overflow: hidden !important;
}

.row {
  display: flex;
  flex-direction: row;
}
.flex {
  display: flex;
}
.column {
  display: flex;
  flex-direction: column
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}

.shadow-right {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
}
</style>
