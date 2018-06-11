import axios from 'axios'
import { API_URL } from '@/config'
import { geobufToLatlngs } from '@/utils'
import { Recorrido, ApiResponse, GeocoderResponse } from './schema'

const client = axios.create({
  baseURL: API_URL,
})

const convertResults = function convertResultsGeobufToLatlngs(
  data: ApiResponse<Recorrido>,
) {
  return {
    ...data,
    results: data.results.map((result: Recorrido) => ({
      ...result,
      itinerario: result.itinerario.map((parte: any) => ({
        ...parte,
        ruta_corta: geobufToLatlngs(parte.ruta_corta),
      })),
    })),
  }
}

interface RecorridosParams {
  lngA: number
  latA: number
  lngB: number
  latB: number
  rad: number
  page: number
}

function recorridos(params: RecorridosParams): Promise<ApiResponse<Recorrido>> {
  const {lngA, latA, lngB, latB, rad, page = 1} = params
  const url = `/recorridos/?l=${lngA},${latA},${rad}|${lngB},${latB},${rad}&c=la-plata&page=${page}&t=false`
  return client.get(url).then(res => convertResults(res.data))
}

function geocoder(query: string): Promise<GeocoderResponse[]> {
  const url = `/geocoder/?q=${query}&c=la-plata)`
  return client.get(url).then(res => res.data)
}

export default {
  recorridos,
  geocoder,
}
