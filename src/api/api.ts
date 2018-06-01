import axios from 'axios'
import { API_URL } from '@/config'
import { Recorrido, ApiResponse } from './schema'

const client = axios.create({
  baseURL: API_URL,
})

const convertResults = function convertResultsGeobufToLatlngs(results: any) {
  return results.map((result: any) =>
    ({
      ...result,
      itinerario: result.itinerario.map((parte: any) =>
        ({ ...parte, ruta_corta: geobufToLatlngs(parte.ruta_corta) })
      ),
    })
  )
}

const recorridos = (
  lngA: number,
  latA: number,
  lngB: number,
  latB: number,
  rad: number,
): Promise<ApiResponse<Recorrido>> => {
  const url = `/recorridos/?l=${lngA},${latA},${rad}|${lngB},${latB},${rad}&c=la-plata&page=1&t=false`
  return client.get(url).then(res => convertResults(res.data.results))
}

export default {
  recorridos,
}
