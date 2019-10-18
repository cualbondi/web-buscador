export interface RecentGeocoderResults {
    query: string
    results: any
    timestamp: number
}
class RecentResultsStore {
  private MAX_RESULTS = 3
  public store(payload: RecentGeocoderResults) {
    const prevResults: any[] = this.getAll()
    let results = prevResults.concat([payload])
    if (results.length > this.MAX_RESULTS) {
      results = results.slice(1, results.length)
    }
    localStorage.setItem('results', JSON.stringify(results))
  }

  public getAll() {
    const raw = localStorage.getItem('results')
    return raw ? JSON.parse(raw) : []
  }

  public top(first = 3) {
    return this.getAll().slice(-1 * first)
  }
}

export const recentResultsStore = new RecentResultsStore()
