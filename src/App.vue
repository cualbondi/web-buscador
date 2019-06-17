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
      <ShareModal v-if="shareModalOpen"/>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ShareModal from '@/components/ShareModal.vue'

@Component({
  components: {
    ShareModal,
  }
})
export default class App extends Vue {
  get shareModalOpen() {
    return this.$store.getters.shareModalOpen
  }
  get messageActive() {
    return this.$store.getters.messageActive
  }
  set messageActive(val) {
    this.$store.dispatch('setMessageActive', val)
  }
  public closeMessage() {
    this.$store.dispatch('setMessageActive', false)
  }
  get messageText() {
    return this.$store.getters.messageText
  }
  public created() {
    this.$store.dispatch('setCiudad', this.$route.params.ciudadSlug)
  }
  public mounted() {
    this.$store.dispatch('initGeolocation')
  }
}
</script>

<style lang="scss">
@import '~leaflet/dist/leaflet.css';
.v-dialog {
  background: #f5f5f5;
  padding: 20px;
}

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
  .v-list__tile__title,
  .v-list__tile__sub-title {
    white-space: normal;
  }
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
