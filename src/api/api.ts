import axios, {
  CancelToken,
  Canceler,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosPromise,
} from 'axios'
import { API_URL } from '@/config'
import { geobufToLatlngs, MakeStatusPromise, StatusPromise } from '@/utils'
import { Recorrido, Itinerario, ApiResponse, GeocoderResponse } from './schema'

const client = axios.create({
  baseURL: API_URL,
})

const CancelToken = axios.CancelToken

const convertSimpleResults = function convertSimpleResultsGeobufToLatlngs(
  data: ApiResponse<Itinerario>,
) {
  return {
    ...data,
    results: data.results.map((recorrido: Itinerario) => ({
      ...recorrido,
      ruta_corta: geobufToLatlngs(recorrido.ruta_corta),
    })),
  }
}

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
  transbordo?: boolean
}
interface RecorridosSearchParams {
  query: string
  page: number
  point: string
  meters?: number
}
type AxiosGetArguments<T = any> = (
  url: string,
  config?: AxiosRequestConfig,
) => AxiosPromise<T>

function CancelableFetcher(axiosClient: AxiosInstance): AxiosGetArguments<any> {
  let promise: StatusPromise<any>
  let cancel: Canceler | null = null

  return (url, options) => {
    if (promise && promise.isPending() && cancel !== null) {
      cancel()
    }
    promise = MakeStatusPromise(
      axiosClient.get(url, {
        ...options,
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
      }),
    )
    return promise
  }
}
class API {
  private getRecorridos: AxiosGetArguments<any>
  private getGeocoding: AxiosGetArguments<any>

  constructor() {
    this.getRecorridos = CancelableFetcher(client)
    this.getGeocoding = CancelableFetcher(client)
  }

  public recorridos(params: RecorridosParams): Promise<ApiResponse<Recorrido>> {
    const {
      lngA,
      latA,
      lngB,
      latB,
      rad,
      page = 1,
      transbordo = false,
    } = params
    const l = `${lngA},${latA},${rad}|${lngB},${latB},${rad}`
    const url = `/recorridos/?l=${l}&page=${page}&t=${transbordo}`

    return this.getRecorridos(url).then(res => convertResults(res.data))
  }

  public recorridosSearch(params: RecorridosSearchParams): Promise<ApiResponse<Itinerario>> {
    const {
      query,
      page = 1,
      meters = 10000,
      point,
    } = params
    const url = `/recorridos/?q=${query}&l=${point[1]},${point[0]},${meters}&page=${page}`

    return this.getRecorridos(url).then(res => convertSimpleResults(res.data))
  }

  public geocoder_suggest(
    query: string,
    ciudadSlug: string,
  ): Promise<GeocoderResponse[]> {
    const url = `/geocoder/suggest/?q=${query}&c=${ciudadSlug}`

    return this.getGeocoding(url).then(res => res.data)
  }

  public geocoder_result(
    q: string,
    c: string,
    mk: string | undefined,
  ): Promise<GeocoderResponse[]> {
    const url = `/geocoder/?q=${q}&c=${c}&mk=${mk}`

    return this.getGeocoding(url).then(res => res.data)
  }
}

const api = new API()
export default api
