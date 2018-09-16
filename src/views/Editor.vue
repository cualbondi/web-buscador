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
      <div>
        <v-layout row wrap>
          <v-flex xs3>
            <v-checkbox label="sync" v-model="linkear_sync"></v-checkbox>
          </v-flex>
          <v-flex xs3>
            <v-btn @click="linkear">linkear</v-btn>
          </v-flex>
        </v-layout>
      </div>
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
      <span>
        <span v-if="disconnected" style="background: red">
          Desconectado
        </span>
        <span v-if="!disconnected" style="background: green">
          Conectado
        </span>
      </span>
      <div>
        <v-btn @click="sortWays()">sortWays</v-btn>
      </div>
      <div>
        <v-btn @click="reverseRelation()">reverseRelation</v-btn>
      </div>
      <div>
        <v-btn @click.stop="OSMPushDialog = true">pushOSM</v-btn>
      </div>
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
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer', maxNativeZoom: 18, maxZoom: 25}" />
      <l-polyline :latLngs="recorrido_cb" color="#333399" />
      <l-polyline :latLngs="selectedWay.nodes" color="#333399" v-if="selectedWay" />
      <l-polyline v-for="(way, $index) in poly_ways" :weight="8" :key="`a-${way.id}-${$index}`" :latLngs="way.nodes" color="#993333" :opacity="0.8" />
      <polylinedecorator v-for="(way, $index) in poly_ways" :key="`b-${way.id}-${$index}`" :patterns="patterns" :paths="[way.nodes]" />
      <l-circle v-for="(way, $index) in poly_ways" :key="`c-${way.id}-${$index}`" :latLng="way.nodes[0]" color="#993333" :opacity="1" :fill="false" :radius="50" v-if="way.disconnected" />
    </l-map>

    <v-dialog
      v-model="OSMPushDialog"
      max-width="500px"
    >
      <v-text-field
        v-model="OSMusername"
        :append-icon="'user'"
        label="Username"
      ></v-text-field>
      <v-text-field
        v-model="OSMpassword"
        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        @click:append="showPassword = !showPassword"
      ></v-text-field>
      <v-btn @click="OSMPushDialog = false">Close</v-btn>
      <v-btn @click="pushOSM()" :disabled="pushingOSM">PUSH!</v-btn>
    </v-dialog>

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
    const index = array.indexOf(way)
    if (index !== -1) {
        array.splice(index, 1)
    }
}

function first_pass(ways: Way[]): Way[] {
  const ret: Way[] = []
  if (ways.length === 1) {
    return ways
  }
  for (let i = 0; i < ways.length - 1; i++) {
    const way: Way = ways[i]
    const curr_last = way.nodes[way.nodes.length - 1]
    const curr_first = way.nodes[0]
    const next = ways[i + 1]
    const next_first = next.nodes[0]
    const next_last = next.nodes[next.nodes.length - 1]
    way.disconnected = false
    if (
      curr_last.id !== next_first.id &&
      curr_last.id !== next_last.id
    ) {
      if (
        curr_first.id !== next_first.id &&
        curr_first.id !== next_last.id
      ) {
        way.disconnected = true
      } else {
        way.nodes = way.nodes.slice().reverse()
      }
    }
    ret.push(way)
  }
  // check last one
  const last = ways[ways.length - 1]
  const prev = ret[ret.length - 1]
  if (last && prev) {
    console.log('last and prev')
    last.disconnected = false
    if (last.nodes[0].id === prev.nodes[prev.nodes.length - 1].id) {
      ret.push(last)
    } else {
      if (last.nodes[last.nodes.length - 1].id === prev.nodes[prev.nodes.length - 1].id) {
          last.nodes = last.nodes.slice().reverse()
          ret.push(last)
      } else {
        last.disconnected = true
        ret.push(last)
      }
    }
  }
  return ret
}

let xmlDocument: Document // lo pongo aca para evitar el reactive de vuejs

@Component({
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    Polylinedecorator,
    LCircle,
  },
})
export default class Home extends Vue {
  public mapCenter = [-34.921111, -57.954444]
  public recorrido_cb = []
  public firsts = []
  public poly_ways: Way[] = []
  public selectedWay = null
  public disconnected = false
  public OSMPushDialog = false
  public OSMusername = ''
  public OSMpassword = ''
  public pushingOSM = false
  public showPassword = false
  public linkear_sync = false

  public osm_id = '3713281'
  public recorridos = []
  public recorridos_osm = []
  public recorrido_selected = null
  public patterns = [decoratorArrow1]

  public linkear() {
    axios({
      headers: {
        authorization: `Bearer facebook ${this.$store.getters.getUser.FBToken}`,
      },
      method: 'patch',
      url: `${API_URL}/recorridos/${this.recorrido_selected}/`,
      data: {
        osm_id: this.osm_id,
        osm_sync: this.linkear_sync,
      },
    }).catch(e => {
      alert('error guardando')
      console.log(e)
    })
  }

  public setRecorrido(recorrido: any) {
    this.recorridos_osm = []
    this.recorrido_cb = []
    this.poly_ways = []
    this.recorrido_selected = recorrido.id
    const llarr = recorrido.ruta.split('(')[1].split(')')[0].split(', ')
    this.recorrido_cb = llarr.map((llstr: any) => llstr.split(' ').map(parseFloat).reverse())
    axios({
      method: 'get',
      url: `${API_URL}/match-recorridos/${recorrido.id}/`,
    }).then((response: any) => {
      this.recorridos_osm = response.data
      const { osm_id } = response.data[0]
      this.osm_id = Math.abs(osm_id).toString()
      this.searchOSM()
    })
  }

  public setRecorrido_osm(recorrido_matched: any) {
    this.osm_id = Math.abs(recorrido_matched.osm_id).toString()
    this.searchOSM()
  }

  // TODO: agregar los recorridos editados moderados, y mostrar fechas de edicion y de OSM

  public sortWays() {

    this.disconnected = false

    const bag = this.poly_ways.slice()
    if (bag.length === 0) {
      return []
    }
    const sorted: Way[] = [bag.shift() as Way]
    while (bag.length !== 0) {
      let current = sorted[sorted.length - 1]
      let current_first = current.nodes[0]
      let current_last = current.nodes[current.nodes.length - 1]
      let found_way

      // let the search begin //

      // search forward, way is also forward
      found_way = bag.find(way => {
        const way_first = way.nodes[0]
        const way_last = way.nodes[way.nodes.length - 1]
        return current_last.id === way_first.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        sorted.push(found_way)
        current = found_way
        continue
      }

      // not found yet, search forward, way backwards
      found_way = bag.find(way => {
        const way_first = way.nodes[0]
        const way_last = way.nodes[way.nodes.length - 1]
        return current_last.id === way_last.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        found_way.nodes = found_way.nodes.slice().reverse()
        sorted.push(found_way)
        current = found_way
        continue
      }


      // current is last on sorted then try with current as first on sorted
      current = sorted[0]
      current_first = current.nodes[0]
      current_last = current.nodes[current.nodes.length - 1]

      // not found yet, search backwards, way forward
      found_way = bag.find(way => {
        const way_first = way.nodes[0]
        const way_last = way.nodes[way.nodes.length - 1]
        return current_first.id === way_last.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        sorted.unshift(found_way)
        current = found_way
        continue
      }

      // not found yet, search backwards, way backwards
      found_way = bag.find(way => {
        const way_first = way.nodes[0]
        const way_last = way.nodes[way.nodes.length - 1]
        return current_first.id === way_first.id
      })
      if (found_way) {
        remove_mutating(bag, found_way)
        found_way.nodes = found_way.nodes.slice().reverse()
        sorted.unshift(found_way)
        current = found_way
        continue
      }

      // not found yet, we'll have to find the closest point in all ways to the last or to the first one in current
      // TODO:
      found_way = bag[0]
      remove_mutating(bag, found_way)
      sorted.push(found_way)
      current = found_way
      console.error('ERRORR disconnected', found_way)

    }
    this.poly_ways = first_pass(sorted)
    this.disconnected = this.poly_ways.filter(w => w.disconnected).length > 0
  }

  public reverseRelation() {
    this.poly_ways.reverse()
    this.poly_ways = first_pass(this.poly_ways)
  }

  public searchOSM() {
    axios({
      method: 'get',
      url: `https://www.openstreetmap.org/api/0.6/relation/${this.osm_id}/full`,
      responseType: 'document',
    }).then(response => {
      this.firsts = []
      const poly: Way[] = []
      const index = 0
      const xml = (response.data as Document)
      xmlDocument = xml
      const wayrefs = xml.getElementsByTagName('relation')[0].querySelectorAll('[type=way]')
      Array.from(wayrefs).map(wref => xml.getElementById((wref as any).getAttribute('ref'))).forEach(way => {
        if (way) {
          const noderefs = way.getElementsByTagName('nd')
          const first = true
          const poly_way: Node[] = []
          Array.from(noderefs).map(nref => xml.getElementById((nref as any).getAttribute('ref'))).forEach(node => {
            if (node) {
              poly_way.push({
                id: (node.getAttribute('id') as string),
                lat: parseFloat(node.getAttribute('lat') as string),
                lng: parseFloat(node.getAttribute('lon') as string),
              })
            }
          })
          const ename = way.querySelectorAll('[k=name]')[0]
          let name
          if (name) {
            const n = ename.getAttribute('v')
            name = n ? n : ''
          } else {
            name = ''
          }
          poly.push({
            id: (way.getAttribute('id') as string),
            name,
            nodes: poly_way,
            disconnected: false,
          })
        }
      })
      this.poly_ways = first_pass(poly)
      this.disconnected = this.poly_ways.filter(w => w.disconnected).length > 0
    })
  }

  public async pushOSM() {
    this.pushingOSM = true
    function xml_tag(xmldoc: any, k: string, v: string) {
      const tag = xmldoc.createElement('tag')
      tag.setAttribute('k', k)
      tag.setAttribute('v', v)
      return tag
    }
    try {
      // TODO: must be wrapped in <osm></osm> tag
      const new_xml = document.implementation.createDocument(null, 'osm', null)
      const xml_relation = xmlDocument.getElementsByTagName('relation')[0].cloneNode(true) as Element
      new_xml.documentElement.appendChild(xml_relation)
      xml_relation.removeAttribute('user')
      xml_relation.removeAttribute('uid')
      xml_relation.removeAttribute('timestamp')
      // remove nodes in order
      const ways_arr = []
      for (let i = 0; i < this.poly_ways.length; i++) {
        const poly_way = this.poly_ways[i]
        const node = xml_relation.querySelectorAll(`[ref='${poly_way.id}']`)[0]
        ways_arr.push(node)
        xml_relation.removeChild(node)
      }
      // check no node is left
      if (xml_relation.querySelectorAll('[type=way]').length !== 0) {
        throw new Error('errorrrr!')
      }
      // put all nodes in order
      for (let i = 0; i < ways_arr.length; i++) {
        const node = ways_arr[i]
        xml_relation.appendChild(node)
      }

      const relationId = xml_relation.getAttribute('id')

      // return console.log(new XMLSerializer().serializeToString(new_xml))
      console.log('new_xml ready!')

      // create changeset
      const xml = document.implementation.createDocument(null, 'osm', null)
      const xml_changeset = xml.createElement('changeset')
      xml_changeset.appendChild(xml_tag(xml, 'created_by', 'Cualbondi Editor 0.0.1'))
      xml_changeset.appendChild(xml_tag(xml, 'comment', 'Repair mixed transport relation by reordering ways'))
      xml.documentElement.appendChild(xml_changeset)


      const changesetId = (await axios({
        method: 'put',
        url: 'https://www.openstreetmap.org/api/0.6/changeset/create',
        auth: {
            username: this.OSMusername,
            password: this.OSMpassword,
        },
        data: new XMLSerializer().serializeToString(xml),
      })).data

      console.log('newChangeset', changesetId)
      xml_relation.setAttribute('changeset', changesetId)

      // rearrange relation xml (global var xmlDocument) to match this.poly_ways
      const newxml = new_xml.cloneNode(true)
      // put/post changed relation referencing changeset
      await axios({
        method: 'put',
        url: `https://www.openstreetmap.org/api/0.6/relation/${relationId}`,
        auth: {
            username: this.OSMusername,
            password: this.OSMpassword,
        },
        data: new XMLSerializer().serializeToString(new_xml),
      })

      // close changeset
      await axios({
        method: 'put',
        url: `https://www.openstreetmap.org/api/0.6/changeset/${changesetId}/close`,
        auth: {
            username: this.OSMusername,
            password: this.OSMpassword,
        },
      })
    } catch (e) {
      console.log(JSON.stringify(e))
      window.alert(e)
    }
    this.pushingOSM = false
  }

  public mounted() {
    // permission check!
    const user = this.$store.getters.getUser
    if (!user || !user.permissions.includes('staff')) {
      this.$store.dispatch('setNextUrl', 'editor')
      this.$router.push({ name: 'login' })
      return
    }
    // end permission check
    axios({
      method: 'get',
      url: `${API_URL}/recorridos-por-ciudad/1/`,
    }).then((response: any) => {
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
