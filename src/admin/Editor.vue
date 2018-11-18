<template>
  <div class="editor">
    <vue-headful
      title="Editor"
      description="Editor de cualbondi"
    />

    <div class="header-left">
      <v-navigation-drawer
        class="navigation"
        v-model="sideMenuOpen"
        temporary
        absolute
        :touchless="true"
      >
        <v-toolbar color="primary">
          <v-spacer></v-spacer>
          <v-toolbar-title class="white--text">
            <img :src="logo" />
            </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="sideMenuOpen = false" class="white--text">
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile>
            <v-select
              class="citySelect"
              :items="ciudades"
              v-model="ciudad"
              item-text="nombre"
              item-value="slug"
              label="Ciudad"
              single-line
              auto
              prepend-icon="map"
              hide-details
            ></v-select>
          </v-list-tile>
          <v-list-tile>
          <v-checkbox 
            label="Best matches"
            hide-details
            v-model="bestMatches"
            @change="searchRecorridos()"
          ></v-checkbox>
          </v-list-tile>
          <v-list-tile>
          <v-checkbox
            label="Show Linked"
            hide-details
            v-model="showLinked"
            @change="searchRecorridos()"
          ></v-checkbox>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-btn  small class="menubtn" flat icon @click="sideMenuOpen = true">
        <v-icon>menu</v-icon>  
      </v-btn>
      <v-progress-circular
      indeterminate
      color="primary"
      v-if="loading"
      :size="20"
      ></v-progress-circular>

    </div>


    <div class="header">
      <v-tooltip bottom>
        <v-btn :disabled="numDisconnections === 0" slot="activator" flat small icon color="indigo" @click="zoomToPrevGap">
          <v-icon>arrow_back</v-icon>
        </v-btn> 
        <span>Zoom to previous gap</span>
      </v-tooltip>
      
      <v-tooltip bottom>
        <v-btn :disabled="numDisconnections === 0" slot="activator" flat small icon color="indigo" @click="zoomToNextGap">
          <v-icon>arrow_forward</v-icon>
        </v-btn>
        <span>Zoom to next gap</span>
      </v-tooltip>

      <v-btn small @click="linkear">linkear</v-btn>
      <v-btn small @click="sortWays()">sortWays</v-btn>
      <v-btn small @click="reverseRelation()">reverseRelation</v-btn>
      <v-btn small @click.stop="OSMPushDialog = true">push OSM</v-btn>
      <v-btn small @click="gotoOSM()">Goto OSM</v-btn>
      <v-btn small @click="editJOSM()">Edit JOSM</v-btn>
    </div>

    <div class="side">
      <v-text-field
        label="Solo"
        placeholder="Recorridos de Cualbondi"
        solo
        hide-details
        v-model="cbSearchText"
      ></v-text-field>
      <v-list class="cb-list" dense>
        <v-list-tile v-for="rec in filteredRecorridosCB" :key="rec.id" @click="setRecorrido(rec)" :class="{'selected': rec.id==recorrido_selected}">
          
          <v-list-tile-content>
            <v-list-tile-title v-text="`${rec.linea.nombre}: ${rec.nombre}`" />
          </v-list-tile-content>
            <v-list-tile-action>
             <v-tooltip bottom>
            <v-icon slot="activator" color="success">{{rec.osm_id ? 'link' : ''}}</v-icon>
            <span>{{rec.osm_id}}</span>
          </v-tooltip>
            </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </div>

    <div class="side2">
      <v-text-field
        label="Solo"
        placeholder="Recorridos de OSM"
        solo
        hide-details
        v-model="osmSearchText"
      ></v-text-field>
      <v-list class="osm-list" dense>
        <v-list-tile v-for="rec in filteredRecorridosOSM" :key="rec.id" @click="setRecorrido_osm(rec)" :class="{'selected': Math.abs(rec.osm_id)==osm_id}">
          <v-list-tile-content>
            <v-list-tile-title v-text="rec.osm_name" />
          </v-list-tile-content>
           <v-list-tile-action>
             <v-tooltip bottom>
                <v-icon slot="activator" color="success">{{rec.linked_recorrido_id ? 'link' : ''}}</v-icon>
                <span>{{rec.linked_recorrido_id}}</span>
              </v-tooltip>
            </v-list-tile-action>
          <v-list-tile-action>
            {{Math.floor(rec.area*1000000)/100}}
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    
    </div>

    <div class="footer">
      <span class="connected">
        <span>
          <span v-if="disconnected" style="background: red">
            {{ numDisconnections }} desconexiones
          </span>
          <span v-if="!disconnected" style="background: green">
            Conectado
          </span>
        </span>
      </span>

      <div class="flex-row osm-id">
        <input
          class="osmid-input"
          v-model="osm_id"
        />
        <v-btn flat small icon @click="searchOSM">
          <v-icon>search</v-icon>
        </v-btn>
      </div>
    </div>

    <l-map :max-zoom="25" :zoom="zoom" :center.sync="mapCenter" ref="mapref" class="map">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :options="{className:'osmTileLayer', maxNativeZoom: 18, maxZoom: 25}" />
      <l-polyline :latLngs="recorrido_cb" color="#333399" ref="cb_layer" />
      <polylinedecorator :patterns="patterns" :paths="[recorrido_cb]" />
      <l-polyline v-for="(way, $index) in poly_ways" :weight="9" :key="`a-${way.id}-${$index}`" :latLngs="way.nodes" color="#993333" :opacity="0.3" ref="osm_layer" />
      <polylinedecorator v-for="(way, $index) in poly_ways" :key="`b-${way.id}-${$index}`" :patterns="patterns" :paths="[way.nodes]" />
      <l-circle v-for="(way, $index) in poly_ways" :key="`c-${way.id}-${$index}`" :latLng="way.nodes[0]" color="#993333" :opacity="1" :fill="false" :radius="50" v-if="way.disconnected" :ref="$index + '_gap_layer'" />
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
import axios from 'axios'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { LCircle, LMap, LTileLayer, LPolyline } from 'vue2-leaflet'
import Polylinedecorator from 'vue2-leaflet-polylinedecorator'
import L from 'leaflet'
import 'leaflet-polylinedecorator'
import { API_URL } from '@/config'
import { gotoOSM, editJOSM } from './utils'

interface Node {
  id: string
  lat: number
  lng: number
}

interface Way {
  id: string
  name: string
  nodes: Node[]
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

const decoratorArrow1 = decoratorBuilder('8', 1)

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
    if (curr_last.id !== next_first.id && curr_last.id !== next_last.id) {
      if (curr_first.id !== next_first.id && curr_first.id !== next_last.id) {
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
      if (
        last.nodes[last.nodes.length - 1].id ===
        prev.nodes[prev.nodes.length - 1].id
      ) {
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
import logo from '@/assets/logo.png'
import { BBox } from 'geojson'

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
  public loading = false
  public sideMenuOpen = false
  public logo = logo
  public mapCenter = [-34.921111, -57.954444]
  public recorrido_cb = []
  public firsts = []
  public poly_ways: Way[] = []
  public disconnected = false
  public OSMPushDialog = false
  public OSMusername = ''
  public OSMpassword = ''
  public pushingOSM = false
  public showPassword = false
  public cbSearchText = ''
  public osmSearchText = ''
  public bestMatches = false
  public showLinked = true

  public osm_id = '3713281'
  public recorridos: Array<any> = []
  public recorridos_osm: Array<any> = []
  public recorrido_selected = null
  public patterns = [decoratorArrow1]
  public selectedGap = 0
  public zoom = 13

  get filteredRecorridosCB() {
    return this.recorridos.filter(
      rec =>
        (rec.linea.nombre + rec.nombre).search(
          new RegExp(this.cbSearchText, 'i'),
        ) !== -1,
    )
  }

  get filteredRecorridosOSM() {
    return this.recorridos_osm.filter(
      rec =>
        rec.osm_name &&
        rec.osm_name.search(new RegExp(this.osmSearchText, 'i')) !== -1,
    )
  }

  public gotoOSM() {
    gotoOSM(this.osm_id)
  }

  public editJOSM() {
    this.loading = true
    editJOSM(this.osm_id, 100)
      .then((response: any) => {
        this.loading = false
      })
      .catch((err: any) => {
        this.loading = false
        console.error(err.toString())
      })
  }

  get ciudad() {
    return this.$store.getters.getCiudad
  }
  set ciudad(ciudadSlug) {
    this.$store.dispatch('setCiudad', ciudadSlug)
    this.searchRecorridos()
  }

  get ciudades() {
    return this.$store.getters.getCiudades
  }

  get numDisconnections() {
    return this.disconnectedWays.length
  }
  get disconnectedWays() {
    const disconnections = []
    for (let i = 0; i < this.poly_ways.length; i++) {
      let w = this.poly_ways[i]
      if (w.disconnected) {
        if (i < this.poly_ways.length - 1) {
          // console.log(i, w, this.poly_ways[i + 1])
          disconnections.push({ waya: w, wayb: this.poly_ways[i + 1] })
        } else {
          disconnections.push({ waya: this.poly_ways[i - 1], wayb: w })
          // console.log(i, this.poly_ways[i - 1], w)
        }
      }
    }
    return disconnections
  }

  public zoomToRef(refName: any) {
    setTimeout(
      () =>
        (this.$refs.mapref as any).mapObject.fitBounds(
          (this.$refs[refName] as any).mapObject.getBounds(),
        ),
      200,
    )
  }

  public panToPoint(point: LatLng) {
    ;(this.$refs.mapref as any).mapObject.flyTo(point, 16, { animate: false })
  }

  public panToBBox(bbox: any) {
    ;(this.$refs.mapref as any).mapObject.fitBounds(bbox)
  }

  public zoomToPrevGap() {
    this.selectedGap =
      this.selectedGap - 1 < 0
        ? this.numDisconnections - 1
        : this.selectedGap - 1
    debugger
    const disconnection = this.disconnectedWays[this.selectedGap]
    const bounds = L.latLngBounds(
      L.latLng(disconnection.waya.nodes[disconnection.waya.nodes.length - 1]),
      L.latLng(disconnection.wayb.nodes[0]),
    )
    this.panToBBox(bounds)
  }

  public zoomToNextGap() {
    this.selectedGap = (this.selectedGap + 1) % this.numDisconnections
    const disconnection = this.disconnectedWays[this.selectedGap]
    const bounds = L.latLngBounds(
      disconnection.waya.nodes[-1],
      disconnection.wayb.nodes[0],
    )
    this.panToBBox(bounds)
  }

  public linkear() {
    this.loading = true
    axios({
      headers: {
        authorization: `Bearer facebook ${this.$store.getters.getUser.FBToken}`,
      },
      method: 'patch',
      url: `${API_URL}/recorridos/${this.recorrido_selected}/`,
      data: {
        osm_id: this.osm_id,
      },
    })
      .then(() => {
        this.loading = false
      })
      .catch(e => {
        alert('error guardando')
        this.loading = false
        console.log(e)
      })
  }

  public setRecorrido(recorrido: any) {
    this.recorridos_osm = []
    this.recorrido_cb = []
    this.poly_ways = []
    this.recorrido_selected = recorrido.id
    const llarr = recorrido.ruta
      .split('(')[1]
      .split(')')[0]
      .split(/, ?/)
    this.recorrido_cb = llarr.map((llstr: any) =>
      llstr
        .split(' ')
        .map(parseFloat)
        .reverse(),
    )
    this.loading = true
    const params: any = {}
    if (this.showLinked) {
      params.showall = true
    }
    axios({
      method: 'get',
      url: `${API_URL}/match-recorridos/${recorrido.id}/`,
      params: params,
    }).then((response: any) => {
      this.recorridos_osm = response.data
      const { osm_id } = response.data[0]
      this.osm_id = Math.abs(osm_id).toString()
      this.searchOSM()
    })

    this.zoomToRef('cb_layer')
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
      const xml = response.data as Document
      xmlDocument = xml
      const wayrefs = xml
        .getElementsByTagName('relation')[0]
        .querySelectorAll('[type=way]')
      Array.from(wayrefs)
        .map(wref => xml.getElementById((wref as any).getAttribute('ref')))
        .forEach(way => {
          if (way) {
            const noderefs = way.getElementsByTagName('nd')
            const first = true
            const poly_way: Node[] = []
            Array.from(noderefs)
              .map(nref =>
                xml.getElementById((nref as any).getAttribute('ref')),
              )
              .forEach(node => {
                if (node) {
                  poly_way.push({
                    id: node.getAttribute('id') as string,
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
              id: way.getAttribute('id') as string,
              name,
              nodes: poly_way,
              disconnected: false,
            })
          }
        })
      this.poly_ways = first_pass(poly)
      this.disconnected = this.poly_ways.filter(w => w.disconnected).length > 0
      this.loading = false
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
      const xml_relation = xmlDocument
        .getElementsByTagName('relation')[0]
        .cloneNode(true) as Element
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
      xml_changeset.appendChild(
        xml_tag(xml, 'created_by', 'Cualbondi Editor 0.0.1'),
      )
      xml_changeset.appendChild(
        xml_tag(
          xml,
          'comment',
          'Repair mixed transport relation by reordering ways',
        ),
      )
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
    this.getRecorridosByName()
  }

  public getRecorridosByName() {
    this.loading = true
    const params: any = {}
    if (this.showLinked) {
      params.showall = true
    }
    axios({
      method: 'get',
      url: `${API_URL}/recorridos-por-ciudad/${this.ciudad.id}/`,
      params: params,
    }).then((response: any) => {
      this.recorridos = response.data
      this.loading = false
    })
  }

  public findBestMatches() {
    this.loading = true
    axios({
      method: 'get',
      url: `${API_URL}/recorridos-best-matches/${this.ciudad.id}/`,
    }).then((response: any) => {
      this.recorridos = response.data
      this.loading = false
    })
  }

  public searchRecorridos() {
    if (this.bestMatches) {
      this.findBestMatches()
    } else {
      this.getRecorridosByName()
    }
  }

  public showLinkedToggle(value: boolean) {
    if (value) {
      this.getRecorridosByName()
    }
  }
}
</script>

<style lang="scss">
// no funciona esto si lo metes adentro de un tag scoped...
.editor {
  .v-text-field.v-text-field--solo .v-input__control {
    min-height: 32px !important;
  }
  .v-list {
    padding: 0;
  }
  .v-list--dense .v-list__tile {
    height: 32px !important;
  }
}
</style>

<style lang="scss" scoped>
.navigation {
  z-index: 20001;
}
.editor {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: 'header-left header' 'side map' 'side2 map' 'side2 footer';
  grid-template-rows: 40px 1fr 1fr 30px;
  grid-template-columns: 400px 1fr;
}
.header {
  grid-area: header;
}
.side {
  z-index: 1000;
  grid-area: side;
  overflow: auto;
  display: grid;
  grid-template-rows: 32px 1fr;
}
.cb-list {
  min-height: 0;
  overflow-y: auto;
}
.side2 {
  margin-top: 5px;
  grid-area: side2;
  display: grid;
  grid-template-rows: 32px 1fr;
}
.osm-list {
  min-height: 0;
  overflow-y: auto;
}
.map {
  grid-area: map;
}
.selected {
  background-color: lightgray;
}
.footer {
  grid-area: footer;
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.osmid-input {
  margin-left: 10px;
}
.header-left {
  grid-area: header-left;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.main > .v-overlay--active {
  z-index: 10000;
}
</style>
