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
