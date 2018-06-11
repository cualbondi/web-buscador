<template>
    <div class="location-search-container">
        <div class="location-search">
            <div class="input-container">
                <v-btn class="menubtn" flat icon @click="goBack">
                    <v-icon>arrow_back</v-icon>  
                </v-btn>
                <v-text-field
                class="input"
               :value="location"
               @input="setLocation"
                :label="inputLabel"
                flat
                solo
                ></v-text-field>
            </div>

            <result-list 
            class="geolocation"
            :results="fixedResults"
            @selection="onGeoSelection"
            ></result-list>

            <result-list
            v-if="!location"
            class="previous-searches" 
            title="Ayer" 
            :results="results"
            @selection="onLocationSelection"
            ></result-list>

             <result-list
            v-if="location"
            class="results" 
            title="Resultados" 
            :results="geocoderResults"
            @selection="onLocationSelection"
            ></result-list>

        </div>
        <Map class="map" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ResultList, { Result } from '@/components/ResultList.vue'
import Map from '@/components/Map.vue'
import debounce from 'lodash/debounce'
import { GeocoderResponse } from '@/api/schema'
import { GeocoderResult } from '@/modules/absearch'

@Component({
  components: {
    ResultList,
    Map,
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

  public results: Result[] = [
    {
      id: 3,
      icon: {
        name: 'access_time',
      },
      text: 'Plaza Moreno',
      subtext: 'Calle 12, La Plata, Buenos Aires',
    },
    {
      id: 4,
      icon: {
        name: 'access_time',
      },
      text: 'Plaza Moreno',
      subtext: 'Calle 12, La Plata, Buenos Aires',
    },
    {
      id: 5,
      icon: {
        name: 'access_time',
      },
      text: 'Plaza Moreno',
      subtext: 'Calle 12, La Plata, Buenos Aires',
    },
    {
      id: 6,
      icon: {
        name: 'access_time',
      },
      text: 'Plaza Moreno',
      subtext: 'Calle 12, La Plata, Buenos Aires',
    },
  ]

  constructor() {
    super()
    this.searchGeocoder = debounce(this.searchGeocoder, 500)
  }

  setLocation(value: string) {
    this.location = value
    this.searchGeocoder(value)
  }

  searchGeocoder(query: string) {
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
      this.$store
        .dispatch('fromGeoLocation', this.originOrDestination)
        .then(() => this.$router.push({ name: 'absearch' }))
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
    const geocoderResult: GeocoderResult = {
      lat: result.geom.coordinates[1],
      lng: result.geom.coordinates[0],
      type: 'geocoder',
      name: result.nombre,
    }
    this.$store
      .dispatch('fromGeocoder', {
        source: this.originOrDestination,
        result: geocoderResult,
      })
      .then(() => this.$router.push({ name: 'absearch' }))
  }

  public goBack() {
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
}
</script>

<style lang="scss" src="./LocationSearch.scss" scoped>
</style>
