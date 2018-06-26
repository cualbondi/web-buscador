<template>
  <div class="absearch" :class="withResults">
    
    <CityHeader />

    <SideMenu />
    
    <ABSearchFields class="top" />
    
    <ABMap class="middle"/>
    
    <ABSearchResults class="bottom" :class="{small: smallResults}" v-if="searchRequested"/>

    <div class="footerad">
      <script2 type="text/javascript" async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script2>
      <ins
        class="adsbygoogle"
        style="display:inline-block;width:320px;height:50px"
        data-ad-client="ca-pub-1193419141108967"
        data-ad-slot="9086127115"
        ></ins>
      <script2>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script2>
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
  get withResults() {
    return this.searchRequested ? 'with-results' : 'no-results'
  }
  get searchRequested() {
    return this.$store.getters.searchRequested
  }
  get smallResults() {
    return this.$store.getters.getSmallResults
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
