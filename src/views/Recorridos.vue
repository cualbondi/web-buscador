<template>
  <div
    class="absearch"
    :class="{'with-results': searchRequested, 'no-results': !searchRequested, transbordo, smallResults}"
  >
    <CityHeader/>

    <SideMenu/>

    <RecorridosSearchFields class="top" :onSearch="onSearch" />

    <RecorridosSearchMap class="middle"/>

    <RecorridosSearchResults class="bottom" v-if="searchRequested"/>

    <div class="footerad">
      <!-- <ins
        class="adsbygoogle"
        style="display:inline-block;width:320px;height:50px"
        data-ad-client="ca-pub-1193419141108967"
        data-ad-slot="9086127115"
      ></ins> -->
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
import { Location, LatLngLocation } from '@/modules/absearch'
import VueScript2 from 'vue-script2'

@Component({
  components: {
    RecorridosSearchFields,
    RecorridosSearchMap,
    SideMenu,
    RecorridosSearchResults,
    CityHeader,
  },
})
export default class Home extends Vue {
  public onSearch(searchString: string) {
    this.updateUrl(searchString)
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

  private updateUrl(searchString: string): void {
    // this is to trim the last url params if they are falsey
    const ciudad = this.$store.getters.getCiudad

    let ciudadSlug = ciudad.slug
    if (!ciudad.id) {
      ciudadSlug = `${ciudad.slug}|${ciudad.latlng[1]},${ciudad.latlng[0]}`
    }

    const params: any = {
      ciudadSlug,
      searchString,
    }

    this.$router.push({
      name: 'recorridos',
      params,
    })
  }

  public mounted() {
    // avoid rendering ads on prerender stage
    if (!window.navigator.userAgent.includes('Headless')) {
      // VueScript2.load(
      //   '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      // )
      // if (!(window as any).adsbygoogle) {
      //   ;(window as any).adsbygoogle = []
      // }
      // ;(window as any).adsbygoogle.push({})
    }
  }
}
</script>

<style lang="scss" src="./ABSearch.scss" scoped>
</style>

<style lang="scss" scoped>
.v-overlay--active {
  z-index: 10000;
}
</style>
