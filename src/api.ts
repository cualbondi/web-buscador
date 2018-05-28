import axios from 'axios'

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.cualbondi.com.ar/v3'
    : 'http://localhost:8082'

const client = axios.create({
  baseURL: apiUrl,
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
