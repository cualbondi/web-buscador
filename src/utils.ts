import Pbf from 'pbf'
import geobuf from 'geobuf'
import store from './store'

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

export interface Coordinates {
  lat: number
  lng: number
  precision: number
}

export const geolocate = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const precision = position.coords.accuracy
          resolve({ lat, lng, precision })
        },
        err => {
          reject(err)
        },
        { enableHighAccuracy: true, maximumAge: 2000 },
      )
    } else {
      reject()
    }
  })

export const checkGeolocationPermission = (
  onPermissionChanged: (status: string) => void,
) => {
  // Check for Geolocation API permissions
  ;(navigator as any).permissions
    .query({ name: 'geolocation' })
    .then(function(permissionStatus: any) {
      onPermissionChanged(permissionStatus.state)
      permissionStatus.onchange = function() {
        onPermissionChanged(this.state)
      }
    })
}
