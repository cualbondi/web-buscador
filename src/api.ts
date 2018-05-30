import axios from 'axios'
import { API_URL } from '@/config'

const client = axios.create({
  baseURL: API_URL,
})

const recorridos = {
  get(lngA: number, latA: number, lngB: number, latB: number, rad: number) {
    const url = `/recorridos/?l=${lngA},${latA},${rad}|${lngB},${latB},${rad}&c=la-plata&page=1&t=false`
    return client.get(url).then(res => res.data.results)
  },
}

export default {
  recorridos,
}
