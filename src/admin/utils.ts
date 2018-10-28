import axios from 'axios'

export function editJOSM(osm_id: any) {
  const overpass_query = `
        [out:json];(relation(${osm_id});)->.R;(way[highway](around[.R]:300);)->.W2;(._;.R;.W2;);out ids;
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
      axios.get(
        `http://127.0.0.1:8111/load_object?objects=${ids}&relation_members=true`,
      )
    })
}

export function gotoOSM(osm_id: any) {
  window.open(`https://openstreetmap.org/relation/${osm_id}`, '_blank')
}
