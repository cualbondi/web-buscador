<template>
  <div class="table-container">
    <v-data-table
      :headers="headers"
      :items="relations"
      :pagination.sync="pagination"
      :rows-per-page-items="[ 10, 50, 100 ]"
    >
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
          <td class="justify-start">{{ props.item.status }}</td>
          <td class="justify-start layout px-0">
            <v-btn
              small
              icon
              fab
              color="white"
              outline
              @click="editJOSM(props.item)"
            >
              <v-icon>
                edit
              </v-icon>
            </v-btn>
            <v-btn
              small
              icon
              fab
              color="white"
              outline
              @click="gotoOSM(props.item)"
            >
              <v-icon>
                search
              </v-icon>
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

@Component({})
export default class OSMDashboard extends Vue {

  public relations: Array<any> = [];
  public headers: Array<any> = [
    { text: 'osm_id', value: 'osm_id' },
    { text: 'status', value: 'status' },
    { text: 'actions', value: 'actions' },
  ]
  public pagination = {
    sortBy: 'status',
    descending: true
  }
  public josmCommandLoading: Boolean;
  public josmCommandError: Boolean;

  public status2color(status: string): string {
    switch (status[0]) {
      case '0': return '#ADA'
      case '1': return '#DDA'
      case '2': return '#DAA'
      case '3': return '#D99'
      case '4': return '#D55'
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

  public editJOSM(relation: any) {
    this.josmCommandLoading = true;
    const overpass_query = `[out:json];(relation(${relation.osm_id});)->.R;(way[highway](around[.R]:300);)->.W2;(._;.R;.W2;);out ids;`
    axios({
      method: 'get',
      url: `http://overpass-api.de/api/interpreter?data=${overpass_query}`
    }).then(response => {
      const ids = response.data.elements.map((e: any) => e.type == 'way' ? `w${e.id}` : e.type == 'relation' ? `r${e.id}` : null).filter((e:string | null) => e != null).reverse().join(',');
      axios({
        method: 'get',
        url: `http://127.0.0.1:8111/load_object?objects=${ids}&relation_members=true`
      }).then((response: any) => {
        this.josmCommandLoading = false;
      }).catch((err: any) => {
        this.josmCommandLoading = false;
        this.josmCommandError = err.toString();
      });
    });
  }

  public gotoOSM(relation: any) {
    window.open(`https://openstreetmap.org/relation/${relation.osm_id}`, '_blank')
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
