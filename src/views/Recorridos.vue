<template>
    <icon-navbar></icon-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import IconNavbar from '@/components/IconNavbar.vue'

@Component({
    components: {
        IconNavbar
    }
})
export default class Recorridos extends Vue {}
</script>
