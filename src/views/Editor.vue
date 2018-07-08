<template>
  <div class="editor">
    <vue-headful
      title="Editor"
      description="Editor de cualbondi"
    />

    <div class="side">
      <v-form @submit.prevent="searchOSM">
        <v-text-field
          v-model="osm_id"
          label="osm relation id"
        ></v-text-field>
        <v-btn @click="searchOSM">
          go!
        </v-btn>
      </v-form>
      <div v-for="rec in recorridos" :key="rec.id" @click="setRecorrido(rec)">
        {{ rec.linea.nombre }} > {{ rec.nombre }}
      </div>
    </div>

    <l-map :zoom="13" :center="[-34.921111,-57.954444]" ref="mapref" class="middle">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}" />
      <l-polyline :latLngs="recorrido_osm" color="#993333" />
      <l-polyline :latLngs="recorrido_cb" color="#333399" />
      <l-marker v-for="ll in firsts" :key="ll[2]" :latLng="ll" />
    </l-map>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import L, { LMarker, LMap, LTileLayer, LPolyline } from 'vue2-leaflet'
import axios from 'axios'
import { API_URL } from '@/config'

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LMarker
  },
})
export default class Home extends Vue {
  recorrido_osm = []
  recorrido_cb = []
  firsts = []

  osm_id = '3713281'
  recorridos = []

  setRecorrido(recorrido) {
    let llarr = recorrido.ruta.split('(')[1].split(')')[0].split(', ')
    this.recorrido_cb = llarr.map(llstr => llstr.split(' ').map(parseFloat).reverse())
    axios({
      method: 'get',
      url: `${API_URL}/match-recorridos/${recorrido.id}/`
    }).then(response => {
      let { osm_id } = response.data[0]
      this.osm_id = Math.abs(osm_id)
      this.searchOSM()
    })
  }

  searchOSM() {
    axios({
      method: 'get',
      url: `http://www.openstreetmap.org/api/0.6/relation/${this.osm_id}/full`,
      responseType: 'document'
    }).then(response => {
      this.recorrido_osm = []
      this.firsts = []
      let index = 0
      const xml = (response.data as Document)
      const wayrefs = xml.getElementsByTagName('relation')[0].querySelectorAll('[type=way]')
      Array.from(wayrefs).map(wref => xml.getElementById(wref.getAttribute('ref'))).forEach(way => {
        const noderefs = way.getElementsByTagName('nd')
        let first = true
        Array.from(noderefs).map(nref => xml.getElementById(nref.getAttribute('ref'))).forEach(node => {
          const ll = [
            parseFloat(node.getAttribute('lat')),
            parseFloat(node.getAttribute('lon')),
            index++
          ]
          if (first) {
            this.firsts.push(ll)
            first = false
          }
          this.recorrido_osm.push(ll)
        })
      });
    })
  }

  created() {
    axios({
      metod: 'get',
      url: `${API_URL}/recorridos-por-ciudad/1/`
    }).then(response => {
      this.recorridos = response.data
    })
  }

}
</script>

<style lang="scss" scoped>
.navigation {
  z-index: 10000;
}
.editor {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: 'side map';
  grid-template-rows: 100%;
  grid-template-columns: 400px 1fr;
}
.side {
  z-index: 1000;
  grid-area: side;
  overflow: auto;
}
.map {
  grid-area: map;
}
</style>

<style lang="scss" scoped>
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
