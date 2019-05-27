<template>
  <div class="topbar">
    <v-btn class="menubtn" flat icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>
    </v-btn>
    <div class="tabs">
      <v-btn class="directions" :class="{active: getTab === 'directions'}" flat dark @click="gotoDirections">
        <v-icon dark>directions</v-icon>
      </v-btn>
      <v-btn class="recorridos" :class="{active: getTab === 'recorridos'}" flat dark @click="gotoRecorridos">
        <v-icon dark>directions_bus</v-icon>
      </v-btn>
    </div>
    <v-btn class="share" flat icon dark @click="share">
      <v-icon dark>share</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class TopBar extends Vue {

  get getTab() {
    return this.$store.getters.getTab
  }

  public openMenu() {
    this.$store.dispatch('openSideMenu')
  }

  public gotoDirections() {
    ;(this as any).$ga.event('tabs', 'directions')
    this.$store.dispatch('setTab', 'directions')
    this.$router.push(`/${this.$store.getters.getCiudad.slug}/`)
  }

  public gotoRecorridos() {
    ;(this as any).$ga.event('tabs', 'recorridos')
    this.$store.dispatch('setTab', 'recorridos')
    this.$router.push(`/${this.$store.getters.getCiudad.slug}/recorridos`)
  }

  public share() {
    if (navigator.share) {
      navigator
        .share({
          title: 'Cualbondi',
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    } else {
      this.$store.dispatch('setShareModal', true)
    }
  }

}
</script>

<style lang="scss">
.topbar {
  display: flex;
  .tabs {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    > button {
      width: 120px;
      &.active {
        background-color: #4FA9D4;
        border-radius: 4px 4px 0px 0px;
        padding: 0;
        margin: 0;
        margin-top: 5px;
        height: 38px;
      }
    }
  }
  .share {
    margin-left: auto;
  }
}
</style>
