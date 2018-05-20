<template>
  <div class="search-container primary">
        <div class="search-input origin">
            <v-icon>directions</v-icon>
        </div>
        <div class="search-input destination">
            <v-icon>directions</v-icon>  
        </div>
        <div class="swap">
            <v-icon>directions</v-icon>
        </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {}
</script>

<style lang="sass" scoped>
.search-container
    height: 200px
    padding: 10px 10px 30px
    display: grid
    grid-template-columns: auto 30px
.swap
    grid-column: 2 / span 1
    grid-row: 1 / span 2
    display: flex;
    justify-content: center
    align-items: center
.origin

</style>
