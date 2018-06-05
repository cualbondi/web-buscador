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

export const geolocate = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(position.coords)
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

type Observer = (position: Coordinates) => void

class GeolocationObservable {
  public static getInstance() {
    if (!GeolocationObservable.instance) {
      GeolocationObservable.instance = new GeolocationObservable()
    }
    return GeolocationObservable.instance
  }
  private static instance: GeolocationObservable

  private started: boolean
  private watchId: number
  private lastCoordinate: Coordinates | null
  // array of observers of every update
  private takeManyObservers: Observer[]
  // array of observers for next value
  private takeFirstObservers: Array<{
    resolve: any
    reject: any
  }>

  private constructor() {
    this.takeManyObservers = []
    this.takeFirstObservers = []
    this.lastCoordinate = null
  }

  public start() {
    this.watchId = navigator.geolocation.watchPosition(
      position => this.update(position.coords),
      err => console.error(err),
      { enableHighAccuracy: true, maximumAge: 2000 },
    )
    this.started = true
  }
  public stop() {
    navigator.geolocation.clearWatch(this.watchId)
    this.started = false
  }
  public update(position: Coordinates) {
    // save for cache
    this.lastCoordinate = position
    // notify observers
    for (const observer of this.takeManyObservers) {
      observer(position)
    }
    // resolve one time promises
    for (const observer of this.takeFirstObservers) {
      observer.resolve(position)
    }
    // reset one time observers
    this.takeFirstObservers = []
  }
  public addListener(observer: Observer) {
    if (!this.started) {
      this.start()
    }
    this.takeManyObservers.push(observer)
  }
  public takeFirst(cache = true): Promise<Coordinates> {
    const lastCoordinate = this.lastCoordinate

    if (!this.started) {
      this.start()
    }
    if (cache && lastCoordinate !== null) {
      return new Promise(resolve => resolve(lastCoordinate))
    }
    return new Promise((resolve, reject) => {
      this.takeFirstObservers.push({
        reject,
        resolve,
      })
    })
  }
}
export const geolocationObservable = GeolocationObservable.getInstance()
