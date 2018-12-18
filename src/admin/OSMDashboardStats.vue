<template>
  <div>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">
        <img :src="logo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <h2>OpenStreetMap Transport Health Tool 🚌🚑</h2>
      <v-spacer></v-spacer>
    </v-toolbar>

    <apexchart type=line height=350 :options="chartOptions" :series="series" />

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'
import { API_URL } from '@/config'
import logo from '@/assets/logo.png'

@Component({
  components: {
    apexchart: () => import('vue-apexcharts')
  }
})
export default class OSMDashboardStats extends Vue {
  public logo = logo
  public stats = {}

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

  public mounted() {

    function getSerie(response: any, id: number, name: string) {
      return {name: name, data: response.data.map((d: any) => {
        if (d.series[id] && d.series[id][name]) {
          return [d.run_timestamp, d.series[id][name]]
        }
        return [d.run_timestamp, 0]
      })}
    }

    axios({
      method: 'get',
      url: `${API_URL}/importerlog-stats/`,
    }).then((response: any) => {
      this.series = []
      this.series.push(getSerie(response, 0, '1: ok, first_pass'))
      this.series.push(getSerie(response, 1, '2: broken, sort'))
      this.series.push(getSerie(response, 2, '3b: broken, sort + tolerance'))
      this.series.push(getSerie(response, 3, '3: broken, tolerance'))
      this.series.push(getSerie(response, 4, '4: broken'))
      this.series.push(getSerie(response, 5, '9: ERROR PROCESSING: \'int\' object is not subscriptable'))
      let t = {name: 'total', data: response.data.map((d: any) => [
        d.run_timestamp,
        d.series.reduce((a: number, b: any) => a + (Object.values(b)[0] as number), 0)
      ])}
      console.log(t)
      this.series.push(t)
    })

  }

  public series = [{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }]

  public chartOptions = {
    chart: {
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    colors: [
      this.status2color('0'),
      this.status2color('1'),
      this.status2color('2'),
      this.status2color('3'),
      this.status2color('4'),
      this.status2color('5'),
      '#CCC',
    ],
    title: {
      text: 'Estado de Relations PTv2 por dia en Argentina',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      type: "datetime"
    }
  }

}
</script>

<style lang="scss">

</style>
