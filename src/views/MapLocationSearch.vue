<template>
    <div class="map-picker">
        <div class="mpicker-header primary row">
            <v-btn class="backbtn" flat icon dark @click="goBack">
                <v-icon dark>arrow_back_ios</v-icon>  
            </v-btn>
            <div class="title flex justify-center align-center">
                Elige un destino
            </div>
        </div>
        <Map class="mpicker-map" />
        
        <v-btn class="mylocation" fab color="white">
            <v-icon dark>my_location</v-icon>
        </v-btn>
        <v-btn large class="mpicker-footer primary--text">Ok</v-btn>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Map from '@/components/Map.vue'

@Component({
    components: {
        Map
    }
})
export default class extends Vue {
    goBack(){
        this.$router.back()
    }
}
</script>


<style lang="scss" scoped>
.mpicker-header {
    height: 48px;
}
.mpicker-footer{
    margin: 0;
    background-color: white !important;
}
.backbtn {
    position: absolute;
    left: 0;
}
.map-picker {
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
}
.title {
    color: white;
}
.mylocation {
    position: absolute;
    right: 0;
    bottom: 50px;
    z-index: 1000;
}
</style>
