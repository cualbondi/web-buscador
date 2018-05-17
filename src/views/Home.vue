<template>

  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-btn icon>
      <v-icon>directions</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>directions_bus</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>share</v-icon>
    </v-btn>
  </v-toolbar>

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component({
  components: {

  }
})
export default class Home extends Vue {
  showNavigation = false
}
</script>

<style lang="scss" scoped>

</style>