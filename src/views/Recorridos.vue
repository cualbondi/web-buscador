<template>
  <div
    class="absearch"
    :class="{'with-results': searchRequested, 'no-results': !searchRequested, transbordo, smallResults}"
  >
    <CityHeader/>

    <SideMenu/>

    <RecorridosSearchFields class="top"/>

    <RecorridosSearchMap class="middle"/>

    <RecorridosSearchResults class="bottom" v-if="searchRequested"/>

    <ShareModal v-if="shareModalOpen"/>

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
import RecorridosSearchFields from '@/components/RecorridosSearchFields.vue'
import RecorridosSearchMap from '@/components/RecorridosSearchMap.vue'
import SideMenu from '@/components/SideMenu.vue'
import RecorridosSearchResults from '@/components/RecorridosSearchResults/RecorridosSearchResults.vue'
import CityHeader from '@/components/CityHeader.vue'
import ShareModal from '@/components/ShareModal.vue'
import { Location, LatLngLocation } from '@/modules/absearch'
import VueScript2 from 'vue-script2'
const splitChar = '|'

@Component({
  components: {
    RecorridosSearchFields,
    RecorridosSearchMap,
    SideMenu,
    RecorridosSearchResults,
    CityHeader,
    ShareModal,
  },
  watch: {
    watchAB(value, oldVal) {
      const { A, B, transbordo } = value
      const self = this as Home
      self.updateUrl(A, B, transbordo)
    },
  },
})
export default class Home extends Vue {
  get watchAB() {
    return {
      A: this.$store.getters.A,
      B: this.$store.getters.B,
      transbordo: this.$store.getters.transbordo,
    }
  }

  public created() {
    // when component is created (i.e from route change)
    // if we have a query param, update the store with that value
    // if not have the query param, set it from $store value

    const location = this.$route.params.location || ''

    const [origin, destination, transbordo] = location.split(splitChar)
    // take url as source of truth
    if (origin) {
      this.$store.dispatch('setA', this.url2location(origin))
    }
    if (destination) {
      this.$store.dispatch('setB', this.url2location(destination))
    }
    if (transbordo === 'transbordo') {
      this.$store.dispatch('setTransbordo', true)
    }
    // fallback to store values
    if (!origin && !destination && !transbordo) {
      this.updateUrl(this.$store.getters.A, this.$store.getters.B, !!transbordo)
    }
  }

  get recorridos() {
    return this.$store.getters.getRecorridosSearchBus
  }
  get searchRequested() {
    return this.$store.getters.searchRequestedSearchBus
  }
  get smallResults() {
    return this.$store.getters.getSmallResultsSearchBus
  }
  get transbordo() {
    return this.$store.getters.transbordoSearchBus
  }
  get shareModalOpen() {
    return this.$store.getters.shareModalOpenSearchBus
  }

  public location2url(location: LatLngLocation) {
    if (!location) {
      return ''
    }
    if (location.type === 'geocoder') {
      return `${location.lng},${location.lat},${location.name}`
    }
    if (
      location.type === 'geolocation' &&
      (location.lng === null || location.lat === null)
    ) {
      return `geolocation`
    }
    return `${location.lng},${location.lat}`
  }

  private updateUrl(
    A: LatLngLocation,
    B: LatLngLocation,
    transbordo: boolean,
  ): void {
    // const urlA = this.location2url(A)
    // const urlB = this.location2url(B)
    // const urlTransbordo = transbordo ? 'transbordo' : ''
    // const locationArr = [urlA, urlB, urlTransbordo]
    // // this is to trim the last url params if they are falsey
    // let i = locationArr.length - 1
    // while (i > 0 && !locationArr[i]) {
    //   i--
    // }
    // const location = locationArr.slice(0, i + 1).join(splitChar)

    // const ciudad = this.$store.getters.getCiudad

    // let ciudadSlug = ciudad.slug
    // if (!ciudad.id) {
    //   ciudadSlug = `${ciudad.slug}|${ciudad.latlng[1]},${ciudad.latlng[0]}`
    // }

    // const params: any = {
    //   ciudadSlug,
    // }
    // if (location) {
    //   params.location = location
    // }

    // this.$router.push({
    //   name: 'absearch-2',
    //   params,
    // })
  }

  private url2location(location: string): Location | undefined {
    return null
    // if (location === 'geolocation') {
    //   return { type: 'geolocation' }
    // }

    // const latLongName = location.split(',')
    // const lng = parseFloat(latLongName.shift() || '')
    // const lat = parseFloat(latLongName.shift() || '')
    // const name = latLongName.join(',')

    // if (!isNaN(lat) && !isNaN(lng)) {
    //   if (name && name.trim()) {
    //     return {
    //       lat,
    //       lng,
    //       name,
    //       type: 'geocoder',
    //     }
    //   } else {
    //     return {
    //       lat,
    //       lng,
    //       type: 'latlng',
    //     }
    //   }
    // }
  }

  public mounted() {
    // avoid rendering ads on prerender stage
    if (!window.navigator.userAgent.includes('Headless')) {
      VueScript2.load(
        '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      )
      if (!(window as any).adsbygoogle) {
        ;(window as any).adsbygoogle = []
      }
      ;(window as any).adsbygoogle.push({})
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
