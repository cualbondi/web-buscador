import axios, { AxiosPromise } from 'axios'

export function editJOSM(osm_id: any, meters: number = 1): AxiosPromise {
  const overpass_query = `
        [out:json];(relation(${osm_id});)->.R;(way[highway](around[.R]:${meters});)->.W2;(._;.R;.W2;);out ids;
    `
  return axios
    .get(`http://overpass-api.de/api/interpreter?data=${overpass_query}`)
    .then(response => {
      const ids = response.data.elements
        .map(
          (e: any) =>
            e.type === 'way'
              ? `w${e.id}`
              : e.type === 'relation'
                ? `r${e.id}`
                : null,
        )
        .filter((e: string | null) => e != null)
        .reverse()
        .join(',')
      return axios.get(
        `http://127.0.0.1:8111/load_object?objects=${ids}&relation_members=true`,
      )
    })
}

export function gotoOSM(osm_id: any): void {
  window.open(`https://openstreetmap.org/relation/${osm_id}`, '_blank')
}
