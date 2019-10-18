<template>
  <div class="location-search-container">
    <div class="location-search">
      <div class="input-container">
        <v-btn class="menubtn" flat icon @click="goBack">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-text-field
          class="input"
          :clearable="true"
          :value="location"
          @input="setLocation"
          :label="inputLabel"
          flat
          solo
          autofocus
          hide-details
          append-icon="search"
          @click:append="searchGeocoder"
        ></v-text-field>
      </div>

      <result-list
        v-if="!location"
        class="geolocation"
        :results="fixedResults"
        @selection="onGeoSelection"
      ></result-list>

      <result-list
        v-if="!location"
        class="previous-searches"
        title="Busquedas previas"
        :results="prevGeocoderResults"
        @selection="onPrevLocationSelection"
      ></result-list>

      <result-list
        v-if="location && geocoderResults.length !== 0"
        class="results"
        title="Resultados"
        :results="geocoderResults"
        @selection="onLocationSelection"
      ></result-list>
      <div v-if="loadingResults" class="progress row justify-center">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </div>
    <ABMap class="map" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ResultList, { Result } from '@/components/ResultList.vue'
import ABMap from '@/components/ABMap.vue'
import { GeocoderResponse } from '@/api/schema'
import { GeocoderResult } from '@/modules/absearch'
import { RecentGeocoderResults } from '@/modules/geocoder/storage'

@Component({
  components: {
    ResultList,
    ABMap,
  },
})
export default class Home extends Vue {
  private location = ''
  public fixedResults: Result[] = [
    {
      id: 1,
      icon: {
        name: 'my_location',
        color: 'primary',
      },
      text: 'Tu ubicación',
    },
    {
      id: 2,
      icon: {
        name: 'location_on',
      },
      text: 'Elegir desde el mapa',
    },
  ]

  public mounted() {
    window.addEventListener('keyup', this.onEnterKey)
  }

  public destroyed() {
    window.removeEventListener('keyup', this.onEnterKey)
  }

  public onEnterKey(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.searchGeocoder()
    }
  }

  public setLocation(value: string) {
    this.location = value
  }

  public searchGeocoder() {
    const query = this.location
    ;(this as any).$ga.event(
      'locationSearch_geocoder',
      this.originOrDestination,
      query,
    )
    this.$store.dispatch('geocode', query)
  }

  get originOrDestination() {
    return this.$route.params.point
  }

  get inputLabel() {
    return this.originOrDestination === 'origin' ? 'Origen' : 'Destino'
  }

  public onGeoSelection(result: Result) {
    if (result.id === 1) {
      this.$store.dispatch('fromGeoLocation', this.originOrDestination)
      this.$router.push({ name: 'absearch' })
      // .catch(err => console.error(err))
    } else {
      this.$router.push({
        name: 'map-location',
        params: { point: this.originOrDestination },
      })
    }
  }

  public onLocationSelection(selection: Result) {
    const result: GeocoderResponse = this.$store.getters.geocoderResults[
      selection.id
    ]
    this.$store.dispatch('setFromGeocoder', {
      result: result,
      source: this.originOrDestination,
    })
    ;(this as any).$ga.event(
      'locationSearch_geocoder_selected',
      this.originOrDestination,
      (result as any).text,
    )
  }

  public onPrevLocationSelection(selection: Result) {
    const prevSearch = this.$store.getters.prevGeocoderResults[
      selection.id
    ]
    this.setLocation(prevSearch.query)
    this.$store.dispatch('fromCache', prevSearch)
  }

  public goBack() {
    ;(this as any).$ga.event('locationSearch', 'back')
    this.$router.back()
  }

  get geocoderResults(): Result[] {
    const results: GeocoderResponse[] = this.$store.getters.geocoderResults
    if (results.length === 0) {
      return []
    }
    return results.map((result, index) => ({
      id: index,
      icon: {
        name: 'access_time',
      },
      text: result.nombre,
    }))
  }

  get prevGeocoderResults(): Result[] {
    const prevResults: RecentGeocoderResults[] = this.$store.getters.prevGeocoderResults
    if (prevResults.length === 0) {
      return []
    }
    return prevResults.map(({ query, result, timestamp }, index) => ({
      id: index,
      icon: {
        name: 'access_time',
      },
      text: query,
    }))
  }

  get loadingResults() {
    return this.$store.getters.getGeocoderLoading
  }
}
</script>

<style lang="scss" src="./LocationSearch.scss" scoped>
</style>
