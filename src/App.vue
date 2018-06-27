<template>
  <v-app>
    <div id="root">
      <router-view/>
      <v-snackbar
        :timeout="5000"
        v-model="messageActive"
        :bottom="true"
      >
        {{ messageText }}
        <v-btn dark flat @click.native="closeMessage">Cerrar</v-btn>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class App extends Vue {
  get messageActive() {
    return this.$store.getters.messageActive
  }
  set messageActive(val) {
    this.$store.dispatch('setMessageActive', val)
  }
  closeMessage() {
    this.$store.dispatch('setMessageActive', false)
  }
  get messageText() {
    return this.$store.getters.messageText
  }
  created() {
    this.$store.dispatch('setCiudad', this.$route.params.ciudadSlug)
  }
  mounted() {
    this.$store.dispatch('initGeolocation')
  }
}
</script>

<style lang="scss">
@import '~leaflet/dist/leaflet.css';

body,
html,
#root {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: Roboto;
  background: #f5f5f5;
  overflow: hidden !important;
}
html {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
  flex-direction: column;
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

.v-snack {
  z-index: 20001 !important;
}
</style>
