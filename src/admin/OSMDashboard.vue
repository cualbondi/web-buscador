<template>
  <div class="table-container">

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">
        <img :src="logo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <h2>OpenStreetMap Transport Status Tool</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="relations"
      :pagination.sync="pagination"
      :rows-per-page-items="[ 10, 50, 100 ]"
      :search="search"
    >

      <template slot="no-results" :value="true" color="error" icon="warning">
        <div>
          No se encontro ninguna ciudad ni linea para "{{ search }}".
        </div>
      </template>

      <template slot="headers" slot-scope="props">
        <tr>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small v-if="pagination.sortBy == header.value && pagination.descending">arrow_upward</v-icon>
            <v-icon small v-if="pagination.sortBy == header.value && !pagination.descending">arrow_downward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>

      <template slot="items" slot-scope="props">
        <tr :style="{'background-color': status2color(props.item.status)}">
          <td class="justify-start">{{ props.item.osm_id }}</td>
          <td class="justify-start">{{ props.item.osm_name }}</td>
          <td class="justify-start">{{ props.item.osm_administrative }}</td>
          <td class="justify-start">{{ props.item.status }}</td>
          <td class="justify-start layout px-0">
            <v-btn
              small
              outline
              @click="!props.item.loading150 && editJOSM(props.item, 150)"
            >
              <v-icon small>
                edit
              </v-icon>
              JOSM <b>+150</b>m
            </v-btn>
            <v-btn
              small
              outline
              @click="!props.item.loading400 && editJOSM(props.item, 400)"
            >
              <v-icon small>
                edit
              </v-icon>
              JOSM <b>+400</b>m
            </v-btn>
            <v-btn
              small
              outline
              @click="gotoOSM(props.item.osm_id)"
            >
              <v-icon small>
                search
              </v-icon>
              osm.org
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'
import { API_URL } from '@/config'
import { gotoOSM, editJOSM } from './utils'
import logo from '@/assets/logo.png'

@Component({})
export default class OSMDashboard extends Vue {
  public search = ''
  public logo = logo
  public relations: Array<any> = []
  public headers: Array<any> = [
    { text: 'osm_id', value: 'osm_id' },
    { text: 'name', value: 'osm_name' },
    { text: 'administrative', value: 'osm_administrative' },
    { text: 'status', value: 'status' },
    { text: 'actions', value: 'actions' },
  ]
  public pagination = {
    sortBy: 'status',
    descending: true,
  }
  public josmCommandLoading: Boolean
  public josmCommandError: Boolean

  public status2color(status: string): string {
    switch (status[0]) {
      case '0': return '#ADA'
      case '1': return '#EEC'
      case '2': return '#ECC'
      case '3': return '#EBB'
      case '4': return '#E99'
      default: return '#FFF'
    }
  }

  public changeSort(column: any) {
    if (this.pagination.sortBy === column) {
      this.pagination.descending = !this.pagination.descending
    } else {
      this.pagination.sortBy = column
      this.pagination.descending = false
    }
  }

  public mounted() {
    axios({
      method: 'get',
      url: `${API_URL}/importerlog/`,
    }).then((response: any) => {
      this.relations = response.data
    })
  }

  public gotoOSM(osm_id: any) {
    gotoOSM(osm_id)
  }
}
</script>

<style lang="scss">
.table-container {
  overflow: auto;
  height: calc(100vh - 60px);
  th {
    text-align: left;
  }
  .v-datatable__actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>
