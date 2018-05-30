<template>
    <div class="location-search-container">
        <div class="location-search">
            <div class="input-container">
                <v-btn class="menubtn" flat icon @click="goBack">
                    <v-icon dark>arrow_back</v-icon>  
                </v-btn>
                <v-text-field
                class="input"
                v-model="location"
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
            class="previous-searches" 
            title="Ayer" 
            :results="results"
            ></result-list>

        </div>
        <Map class="map" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ResultList, { Result } from '@/components/ResultList.vue'
import Map from '@/components/Map.vue'

@Component({
  components: {
    ResultList,
    Map,
  },
})
export default class Home extends Vue {
  public location = ''
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

  public goBack() {
    this.$router.back()
  }
}
</script>

<style lang="scss" src="./LocationSearch.scss" scoped>
</style>
