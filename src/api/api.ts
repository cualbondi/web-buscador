import axios from 'axios'
import { API_URL } from '@/config'
import { Recorrido, ApiResponse } from './schema'
import { geobufToLatlngs } from '@/utils'

const client = axios.create({
  baseURL: API_URL,
})

const convertResults = function convertResultsGeobufToLatlngs(data: ApiResponse<Recorrido>) {
  return {
    ...data,
    results: data.results.map((result: Recorrido) =>
      ({
        ...result,
        itinerario: result.itinerario.map((parte: any) =>
          ({ ...parte, ruta_corta: geobufToLatlngs(parte.ruta_corta) })
        ),
      })
    ),
  }
}

const recorridos = (
  lngA: number,
  latA: number,
  lngB: number,
  latB: number,
  rad: number,
  page = 1,
): Promise<ApiResponse<Recorrido>> => {
  const url = `/recorridos/?l=${lngA},${latA},${rad}|${lngB},${latB},${rad}&c=la-plata&page=${page}&t=false`
  return client.get(url).then(res => convertResults(res.data))
}

export default {
  recorridos,
}
