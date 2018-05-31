<template>
  <MapLocationPicker />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MapLocationPicker from '@/components/MapLocationPicker.vue'

@Component({
  components: {
    MapLocationPicker,
  },
})
export default class extends Vue {
}
</script>


<style lang="scss" scoped>

</style>
