<template>
  <div class="search-container primary shadow-right">

    <TopBar />

    <div class="input-location origin" @click="searchOrigin">
      <div class="cue"></div>
      {{ locationOrigin }}
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Location } from '@/modules/absearch'
import TopBar from '@/components/TopBar.vue'

@Component({
  components: {
    TopBar,
  },
})
export default class Home extends Vue {

  get locationOrigin() {
    const location: Location | null = this.$store.getters.A
    if (location === null) {
      return 'Selecciona un origen'
    }
    if (location.type === 'geolocation') {
      return 'Tu ubicacion'
    }
    if (location.type === 'geocoder') {
      return location.name
    }
    return `${location.lat}, ${location.lng}`
  }

  public searchOrigin() {
    this.$router.push({ name: 'location', params: { point: 'origin' } })
  }

}
</script>

<style lang="scss" src="./ABSearchFields.scss" scoped>
</style>
