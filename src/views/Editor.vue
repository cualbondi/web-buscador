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

    <div class="side3">
      ways
      <v-btn @click="sortWays()">
      sortWays
      </v-btn>
      <v-list>
        <v-list-tile v-for="(way, $index) in poly_ways" :key="`x-${way.id}-${$index}`" @click="selectedWay=way" :class="{'selected': selectedWay && selectedWay.id == way.id}">
          <v-list-tile-content>
            {{ $index }}
          </v-list-tile-content>
          <v-list-tile-action>
            <span v-if="!way.disconnected">
              ok
            </span>
            <span v-if="way.disconnected">
              X
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </div>

    <l-map :max-zoom="25" :zoom="13" :center.sync="mapCenter" ref="mapref" class="middle">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer'}" />
      <l-polyline :latLngs="recorrido_cb" color="#333399" />
      <l-polyline :latLngs="selectedWay.nodes" color="#333399" v-if="selectedWay" />
      <l-polyline v-for="(way, $index) in poly_ways" :weight="8" :key="`a-${way.id}-${$index}`" :latLngs="way.nodes" color="#993333" :opacity="0.8" />
      <polylinedecorator v-for="(way, $index) in poly_ways" :key="`b-${way.id}-${$index}`" :patterns="patterns" :paths="[way.nodes]" />
      <l-circle v-for="(way, $index) in poly_ways" :key="`c-${way.id}-${$index}`" :latLng="way.nodes[0]" color="#993333" :opacity="1" :fill="false" :radius="50" v-if="way.disconnected" />
    </l-map>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LCircle, LMap, LTileLayer, LPolyline } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-polylinedecorator'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import axios from 'axios'
import { API_URL } from '@/config'

interface Node {
  id: string,
  lat: number,
  lng: number
}

interface Way {
  id: string,
  name: string,
  nodes: Node[],
  disconnected: boolean
}

const decoratorBuilder = function(offset: string, opacity: number) {
  return {
    offset,
    repeat: 150,
    symbol: L.Symbol.arrowHead({
      pixelSize: 6,
      polygon: false,
      pathOptions: {
        color: '#000',
        opacity,
        weight: 2,
      },
    }),
  }
}
const decoratorArrow1 = decoratorBuilder('5', 1)

function remove_mutating(array: Way[], way: Way) {
    const index = array.indexOf(way);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function first_pass(ways: Array<Way>): Array<Way> {
  let ret: Array<Way> = []
  let way: Way | undefined;
  if (ways.length == 1) {
    return ways
  }
  for (let i = 0; i < ways.length-1; i++) {
    const way = ways[i];
    const curr_last = way.nodes[way.nodes.length-1];
    const curr_first = way.nodes[0];
    const next = ways[i+1]
    const next_first = next.nodes[0];
    const next_last = next.nodes[next.nodes.length-1];
    way.disconnected = false
    if (
      curr_last.id != next_first.id &&
      curr_last.id != next_last.id
    ) {
      if (
        curr_first.id != next_first.id &&
        curr_first.id != next_last.id
      ) {
        way.disconnected = true
      }
      else {
        way.nodes = way.nodes.slice().reverse()
      }
    }
    ret.push(way)
  }
  return ret
}

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    Polylinedecorator,
    LCircle
  },
})
export default class Home extends Vue {
  mapCenter = [-34.921111,-57.954444]
  recorrido_cb = []
  firsts = []
  poly_ways: Array<Way> = []
  selectedWay = null

  osm_id = '3713281'
  recorridos = []
  recorridos_osm = []
  recorrido_selected = null
  public patterns = [decoratorArrow1]

  setRecorrido(recorrido) {
    this.recorridos_osm = []
    this.recorrido_cb = []
    this.poly_ways = []
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

  // TODO: agregar los recorridos editados moderados, y mostrar fechas de edicion y de OSM

  sortWays() {
    // WIP look the todo, this method will loop infinitely
    let bag = this.poly_ways.slice()
    if (bag.length == 0) {
      return []
    }
    let current = (bag.shift() as Way)
    let sorted: Way[] = [current]
    while (bag.length != 0) {
      let current_first = current.nodes[0]
      let current_last = current.nodes[current.nodes.length-1]
      let found_way

      // let the search begin //

      // search forward, way is also forward
      found_way = bag.find(way => {
        let way_first = way.nodes[0]
        let way_last = way.nodes[way.nodes.length-1]
        return current_last.id == way_first.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        sorted.push(found_way)
        current = found_way
        continue;
      }

      // not found yet, search forward, way backwards
      found_way = bag.find(way => {
        let way_first = way.nodes[0]
        let way_last = way.nodes[way.nodes.length-1]
        return current_last.id == way_last.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        found_way.nodes = found_way.nodes.slice().reverse()
        sorted.push(found_way)
        current = found_way
        continue;
      }

      // not found yet, search backwards, way forward
      found_way = bag.find(way => {
        let way_first = way.nodes[0]
        let way_last = way.nodes[way.nodes.length-1]
        return current_first.id == way_last.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        sorted.unshift(found_way)
        current = found_way
        continue;
      }

      // not found yet, search backwards, way backwards
      found_way = bag.find(way => {
        let way_first = way.nodes[0]
        let way_last = way.nodes[way.nodes.length-1]
        return current_first.id == way_first.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        found_way.nodes = found_way.nodes.slice().reverse()
        sorted.unshift(found_way)
        current = found_way
        continue;
      }

      // not found yet, we'll have to find the closest point in all ways to the last or to the first one in current
      // TODO:
      found_way = bag[0]
      remove_mutating(bag, found_way)
      sorted.push(found_way)
      current = found_way
      console.error('ERRORR desconectado', found_way)

    }
    this.poly_ways = first_pass(sorted);
  }

  searchOSM() {
    axios({
      method: 'get',
      url: `https://www.openstreetmap.org/api/0.6/relation/${this.osm_id}/full`,
      responseType: 'document'
    }).then(response => {
      this.firsts = []
      let poly: Array<Way> = []
      let index = 0
      const xml = (response.data as Document)
      const wayrefs = xml.getElementsByTagName('relation')[0].querySelectorAll('[type=way]')
      Array.from(wayrefs).map(wref => xml.getElementById(wref.getAttribute('ref'))).forEach(way => {
        const noderefs = way.getElementsByTagName('nd')
        let first = true
        let poly_way: Array<Node> = []
        Array.from(noderefs).map(nref => xml.getElementById(nref.getAttribute('ref'))).forEach(node => {
          poly_way.push({
            id: (node.getAttribute('id') as string),
            lat: parseFloat(node.getAttribute('lat') as string),
            lng: parseFloat(node.getAttribute('lon') as string)
          })
        })
        let name = way.querySelectorAll('[k=name]')[0]
        name = name ? name.getAttribute('v') : ''
        poly.push({
          id: (way.getAttribute('id') as string),
          name,
          nodes: poly_way,
          disconnected: false
        })
      });
      this.poly_ways = first_pass(poly);
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
  grid-template-areas: 'side side2 side3 map';
  grid-template-rows: 100%;
  grid-template-columns: 400px 300px 200px 1fr;
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
.side3 {
  z-index: 1000;
  grid-area: side3;
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
