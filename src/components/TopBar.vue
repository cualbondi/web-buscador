<template>
  <div class="topbar">
    <v-btn class="menubtn" text icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>
    </v-btn>
    <div class="tabs">
      <v-btn class="directions" :class="{active: getTab === 'directions'}" text dark @click="gotoDirections">
        <v-icon dark>directions</v-icon>
      </v-btn>
      <v-btn class="recorridos" :class="{active: getTab === 'recorridos'}" text dark @click="gotoRecorridos">
        <v-icon dark>directions_bus</v-icon>
      </v-btn>
    </div>
    <v-btn class="share" text icon dark @click="share">
      <v-icon dark>share</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class TopBar extends Vue {

  get getTab() {
    return this.$route.name == 'recorridos' ? 'recorridos' : 'directions'
  }

  public openMenu() {
    this.$store.dispatch('openSideMenu')
  }

  public gotoDirections() {
    ;(this as any).$ga.event('tabs', 'directions')
    this.$store.dispatch('setTab', 'directions')
    const ciudad = this.$store.getters.getCiudad
    let ciudadSlug = ciudad.slug
    if (!ciudad.id) {
      ciudadSlug = `${ciudad.slug}|${ciudad.latlng[1]},${ciudad.latlng[0]}`
    }
    this.$router.push(`/${ciudadSlug}/`)
  }

  public gotoRecorridos() {
    ;(this as any).$ga.event('tabs', 'recorridos')
    this.$store.dispatch('setTab', 'recorridos')
    const ciudad = this.$store.getters.getCiudad
    let ciudadSlug = ciudad.slug
    if (!ciudad.id) {
      ciudadSlug = `${ciudad.slug}|${ciudad.latlng[1]},${ciudad.latlng[0]}`
    }
    this.$router.push(`/${ciudadSlug}/recorridos/`)
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
