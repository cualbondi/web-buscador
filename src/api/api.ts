import axios from 'axios'
import { API_URL } from '@/config'
import { Recorrido, ApiResponse } from './schema'

const client = axios.create({
  baseURL: API_URL,
})

const recorridos = (
  lngA: number,
  latA: number,
  lngB: number,
  latB: number,
  rad: number,
): Promise<ApiResponse<Recorrido>> => {
  const url = `/recorridos/?l=${lngA},${latA},${rad}|${lngB},${latB},${rad}&c=la-plata&page=1&t=false`
  return client.get(url).then(res => res.data)
}

export default {
  recorridos,
}
