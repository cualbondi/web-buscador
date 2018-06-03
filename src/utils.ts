import Pbf from 'pbf'
import geobuf from 'geobuf'

export const geobufToLatlngs = function(base64str: string) {
  // convert base64str to Uint8Array
  const raw = atob(base64str)
  const rawLength = raw.length
  const array = new Uint8Array(new ArrayBuffer(rawLength))
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i)
  }

  // decode geobuf into geojson
  const geojson = geobuf.decode(new Pbf(array))

  // flip lat & lng
  const coordinates = geojson.coordinates.slice()
  for (const coordinate of coordinates) {
    coordinate.reverse()
  }

  return coordinates
}

export interface LatLng {
  lat: string, lng: string
}

export const geolocate = (): Promise<LatLng> =>
  new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude.toString()
          const lng = position.coords.longitude.toString()
          resolve({ lat, lng })
        },
        err => {
          reject(err)
        },
        { enableHighAccuracy: true },
      )
    } else {
      reject()
    }
  })
