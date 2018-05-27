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
            title="Yesterday" 
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
  fixedResults: Result[] = [
    {
      id: 1,
      icon: {
        name: 'my_location',
        color: 'primary',
      },
      text: 'Your location',
    },
    {
      id: 2,
      icon: {
        name: 'location_on',
      },
      text: 'Choose on map',
    },
  ]

  results: Result[] = [
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

  onGeoSelection(result: Result) {
    if (result.id === 1) {
      this.$store
        .dispatch('fromGeoLocation', this.originOrDestination)
        .then(() => this.$router.push({ name: 'absearch' }))
        .catch(err => console.error(err))
    } else {
      // open map picker view
    }
  }

  goBack() {
    this.$router.back()
  }
}
</script>

<style lang="scss" scoped>
.location-search-container {
  display: grid;
  height: 100%;
}
@media (max-width: 600px) {
  .location-search-container {
    grid-template-columns: 1fr;
    grid-template-areas: 'search';
  }
}
@media (min-width: 601px) {
  .location-search-container {
    grid-template-columns: 400px auto;
    grid-template-areas: 'search map';
  }
}
.map {
  grid-area: map;
}
.location-search {
  margin: 7px;
  grid-area: search;
  
}
.geolocation {
  margin-bottom: 15px;
}
.input-container {
  display: flex;
  flex-direction: row;
  background: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>
