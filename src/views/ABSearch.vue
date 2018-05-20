<template>
  <div>
    <icon-navbar></icon-navbar>
    <a-b-search-fields></a-b-search-fields>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import IconNavbar from '@/components/IconNavbar.vue'
import ABSearchFields from '@/components/ABSearchFields.vue'

@Component({
  components: {
    IconNavbar,
    ABSearchFields
  }
})
export default class Home extends Vue {
}
</script>

<style lang="sass" scoped>

</style>
