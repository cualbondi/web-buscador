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
import VueScript2 from 'vue-script2'

@Component({
  components: {
    ABSearchFields,
    ABMap,
    SideMenu,
    ABSearchResults,
    CityHeader,
  },
})
export default class Home extends Vue {
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
