interface Parada {
  codigo: string
  latlng: string
  nombre: string
}
export interface Itinerario {
  id: number
  ruta_corta: string
  long_bondi: number
  long_pata: number
  color_polilinea: string
  inicio: string
  fin: string
  nombre: string
  foto: string
  p1: null | Parada
  p2: null | Parada
}
export interface Recorrido {
  id: number
  itinerario: Itinerario[]
}
export interface ApiResponse<Result> {
  next: string | null
  previous: string | null
  count: number
  page: number
  page_size: number
  page_count: number
  results: Result[]
}
export interface GeocoderResponse {
  nombre: string
  geom: {
    type: string
    coordinates: number[],
  }
  precision: number
  tipo: string
}
