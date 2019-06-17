<template>
  <div class="search-container primary shadow-right">

    <TopBar />

    <v-text-field
      label="Buscar bus"
      append-icon="search"
      single-line
      full-width
      hide-details
      class="searchInput"
      color="white"
      dark
      @click:append="search"
      @keyup.enter="search"
      v-model="searchString"
      type="search"
    ></v-text-field>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Location } from '@/modules/absearch'
import TopBar from '@/components/TopBar.vue'

@Component({
  components: {
    TopBar,
  },
})
export default class RecorridoSearchFields extends Vue {

  @Prop()
  public onSearch: (arg0: string) => void

  public searchString: string = ''
  public search2: string = ''

  public created() {
    // when component is created (i.e from route change)
    // if we have a query param, update the store with that value
    // if not have the query param, set it from $store value

    const location = this.$route.params.searchString || ''
    this.$store.dispatch('clearResultsSearchBus')
    if (location) {
      this.searchString = location
      this.search()
    }
  }

  search() {
    this.$store.dispatch('setSearchStringSearchBus', this.searchString)
    this.$store.dispatch('searchBus', this.searchString)
    this.onSearch(this.searchString)
  }

}
</script>

<style lang="scss" scoped>
.searchInput {
  background-color: #4FA9D4;
}
.v-text-field.v-text-field--full-width.v-input {
  margin: -2px 14px;
}
</style>
