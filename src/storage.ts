import { GeocoderResponse } from './api/schema'

export interface RecentGeocoderResults {
  query: string
  results: any
  timestamp: number
}
export interface RecentLocationResult {
  location: GeocoderResponse
  timestamp: number
}
class PersistentStorage {
  private MAX_RESULTS = 3
  public logQuery(payload: RecentGeocoderResults) {
    const prevResults = this.getQueries().filter(r => r.query !== payload.query)
    let results = prevResults.concat([payload])
    if (results.length > this.MAX_RESULTS) {
      results = results.slice(1, results.length)
    }
    localStorage.setItem('results', JSON.stringify(results))
  }

  public getQueries(): RecentGeocoderResults[] {
    const raw = localStorage.getItem('results')
    return raw ? JSON.parse(raw) : []
  }

  public topQueries(first = 3): RecentGeocoderResults[] {
    return this.getQueries()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, first)
  }

  public logLocation(payload: RecentLocationResult) {
    const prevResults = this.getLocations().filter(r => r.location.nombre !== payload.location.nombre)
    let results = prevResults.concat([payload])
    if (results.length > this.MAX_RESULTS) {
      results = results.slice(1, results.length)
    }
    localStorage.setItem('locations', JSON.stringify(results))
  }

  public getLocations(): RecentLocationResult[] {
    const raw = localStorage.getItem('locations')
    return raw ? JSON.parse(raw) : []
  }

  public topLocations(first = 3): RecentLocationResult[] {
    return this.getLocations()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, first)
  }
}

export const persistentStorage = new PersistentStorage()
