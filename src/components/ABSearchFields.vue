<template>
  <div class="search-container primary">
    <v-btn class="menubtn" flat icon dark @click="openMenu">
      <v-icon dark>menu</v-icon>  
    </v-btn>
    <v-text-field
      class="input-origin"
      v-model="origin"
      label="Origen"
      dark
      :single-line="true"
      :hide-details="true"
    ></v-text-field>
    <v-text-field
      class="input-dest"
      v-model="dest"
      label="Destino"
      dark
      :single-line="true"
      :hide-details="true"
    ></v-text-field>
    <div class="swap">
      <v-icon dark>swap_vert</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  origin = ''
  dest = ''
  openMenu() {
    this.$store.dispatch('openSideMenu')
  }
}
</script>

<style lang="scss" scoped>
  .search-container {
    height: 130px;
    display: grid;
    grid-template-columns: auto 30px;
    grid-template-rows: 25px 50px 50px;
    grid-row-gap: 0
  }
  .swap {
    grid-column: 2;
    grid-row: 2 / span 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .input-origin {
    grid-column: 1;
    grid-row: 2;
  }
  .input-dest {
    grid-column: 1;
    grid-row: 3;
  }
  .menubtn {
    grid-column: 1;
    grid-row: 1;
  }
  .input-group {
    padding-top: 0;
    margin-left: 20px
  }
</style>
