<template>
  <div class="absearch" :class="{'with-results': searchRequested, 'no-results': !searchRequested, transbordo, smallResults}">

    <CityHeader />

    <SideMenu />

    <ABSearchFields class="top" />

    <ABMap class="middle"/>

    <ABSearchResults class="bottom" v-if="searchRequested"/>

    <div class="footerad">
      <ins
        class="adsbygoogle"
        style="display:inline-block;width:320px;height:50px"
        data-ad-client="ca-pub-1193419141108967"
        data-ad-slot="9086127115"
        ></ins>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ABSearchFields from '@/components/ABSearchFields.vue'
import ABMap from '@/components/ABMap.vue'
import SideMenu from '@/components/SideMenu.vue'
import ABSearchResults from '@/components/ABSearchResults/ABSearchResults.vue'
import CityHeader from '@/components/CityHeader.vue'
import { Location } from '@/modules/absearch'
import VueScript2 from 'vue-script2'


@Component({
  components: {
    ABSearchFields,
    ABMap,
    SideMenu,
    ABSearchResults,
    CityHeader,
  }
})
export default class Home extends Vue {

  created() {
    // when component is created (i.e from route change)
    // if we have a query param, update the store with that value
    // if not have the query param, set it from $store value

    let queryParams: any = {}

    const from = this.parseLocation(this.$route.query.from);
    const to = this.parseLocation(this.$route.query.to);
    const transbordo = this.$route.query.transbordo


    if (from) {
      this.$store.dispatch('setA', from);
    } else if (this.$store.getters.A !== null) {
      queryParams.from = this.location2Query(this.$store.getters.A)
    }

    if (to) {
      this.$store.dispatch('setB', to);
    } else if (this.$store.getters.B !== null) {
      queryParams.to = this.location2Query(this.$store.getters.B)
    }

    if (transbordo !== undefined) {
      this.$store.dispatch('setTransbordo', !!(parseInt(transbordo)));
    } else {
      queryParams.transbordo = this.transbordo?'1':'0'
    }

    if (Object.keys(queryParams).length !== 0) {
      this.$router.replace({query: Object.assign({}, this.$route.query, queryParams)})
    }
  }

  get recorridos() {
    return this.$store.getters.getRecorridos
  }
  get searchRequested() {
    return this.$store.getters.searchRequested
  }
  get smallResults() {
    return this.$store.getters.getSmallResults
  }
  get transbordo() {
    return this.$store.getters.transbordo
  }

  private parseLocation(location: string): Location | false {
    if (typeof(location) !== 'string') {
      return false
    }

    if (location == 'geolocation') {
      return {type: 'geolocation'} ;
    }

    const latLongName = location.split(",");
    const lat = parseFloat(latLongName.shift() || '');
    const lng = parseFloat(latLongName.shift() || '');
    const name = latLongName.join(",");

    if (!isNaN(lat) && !isNaN(lng)) {
      if (name && name.trim()) {
        return {
          lat,
          lng,
          name,
          type: 'geocoder',
        };
      } else {
        return {
          lat,
          lng,
          type: 'latlng',
        };
      }
    }

    return false;
  }

  private location2Query(location: Location): string {
    if (location == null) {
      return ''
    }

    if (location.type === 'geolocation'){
      return 'geolocation'
    }

    if (location.type === 'latlng') {
      return [location.lat, location.lng].join(',')
    }

    return [location.lat, location.lng, location.name].join(',')
  }

  mounted() {
    // avoid rendering ads on prerender stage
    if (!window.navigator.userAgent.includes('Headless')) {
      VueScript2.load('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
      if (!(window as any).adsbygoogle) {
        (window as any).adsbygoogle = []
      }
      (window as any).adsbygoogle.push({})
    }

  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>

<style lang="scss" scoped>
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
