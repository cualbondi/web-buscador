<template>
  <div class="editor">
    <vue-headful
      title="Editor"
      description="Editor de cualbondi"
    />

    <div class="side">
      Recorridos de cualbondi
      <v-list>
        <v-list-tile v-for="rec in recorridos" :key="rec.id" @click="setRecorrido(rec)" :class="{'selected': rec.id==recorrido_selected}">
          {{ rec.linea.nombre }}: {{ rec.nombre }}
        </v-list-tile>
      </v-list>
    </div>

    <div class="side2">
      Recorridos matcheados de OSM
      <v-form @submit.prevent="searchOSM">
        <v-text-field
          v-model="osm_id"
          label="osm relation id"
        ></v-text-field>
        <v-btn @click="searchOSM">
          go!
        </v-btn>
      </v-form>
      <v-list>
        <v-list-tile v-for="rec in recorridos_osm" :key="rec.id" @click="setRecorrido_osm(rec)" :class="{'selected': Math.abs(rec.osm_id)==osm_id}">
          <v-list-tile-content>
            <v-list-tile-title v-text="rec.osm_name" />
          </v-list-tile-content>
          <v-list-tile-action>
            {{Math.floor(rec.area*1000000)/100}}
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </div>

    <l-map :max-zoom="25" :zoom="13" :center.sync="mapCenter" ref="mapref" class="middle">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}" />
      <l-polyline :latLngs="recorrido_cb" color="#333399" />
      <l-polyline :latLngs="recorrido_osm" color="#993333" opacity="0.9" />
      <l-circle v-for="ll in firsts" :key="ll[2]" :latLng="ll" fill-color="#993333" fill-opacity="0.6" :stroke="false" :radius="5" />
    </l-map>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import L, { LCircle, LMap, LTileLayer, LPolyline } from 'vue2-leaflet'
import axios from 'axios'
import { API_URL } from '@/config'

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LCircle
  },
})
export default class Home extends Vue {
  mapCenter = [-34.921111,-57.954444]
  recorrido_osm = []
  recorrido_cb = []
  firsts = []

  osm_id = '3713281'
  recorridos = []
  recorridos_osm = []
  recorrido_selected = null

  setRecorrido(recorrido) {
    this.recorridos_osm = []
    this.recorrido_osm = []
    this.recorrido_cb = []
    this.recorrido_selected = recorrido.id
    let llarr = recorrido.ruta.split('(')[1].split(')')[0].split(', ')
    this.recorrido_cb = llarr.map(llstr => llstr.split(' ').map(parseFloat).reverse())
    axios({
      method: 'get',
      url: `${API_URL}/match-recorridos/${recorrido.id}/`
    }).then(response => {
      this.recorridos_osm = response.data
      let { osm_id } = response.data[0]
      this.osm_id = Math.abs(osm_id)
      this.searchOSM()
    })
  }

  setRecorrido_osm(recorrido_matched) {
    this.osm_id = Math.abs(recorrido_matched.osm_id)
    this.searchOSM()
  }

  searchOSM() {
    axios({
      method: 'get',
      url: `https://www.openstreetmap.org/api/0.6/relation/${this.osm_id}/full`,
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
  grid-template-areas: 'side side2 map';
  grid-template-rows: 100%;
  grid-template-columns: 400px 400px 1fr;
}
.side {
  z-index: 1000;
  grid-area: side;
  overflow: auto;
}
.side2 {
  z-index: 1000;
  grid-area: side2;
  overflow: auto;
}
.map {
  grid-area: map;
}
.selected {
  background-color: lightgray;
}
</style>

<style lang="scss" scoped>
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
